const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const Admin = require('./models/Admin');
const Item = require('./models/FundraisingItem');
const Contribution = require('./models/Contribution');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CURRENCY = process.env.CURRENCY || 'NGN';

if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET) {
  throw new Error('Set MONGODB_URI and SESSION_SECRET in your environment before starting the server.');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');
app.use(helmet());
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(session({
  name: 'luxe.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8
  }
}));

// A small session-bound CSRF token protects all form submissions.
app.use((req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  res.locals.csrfToken = req.session.csrfToken;
  res.locals.currentPath = req.path;
  res.locals.formatMoney = (kobo) => new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: CURRENCY, maximumFractionDigits: 2
  }).format((Number(kobo) || 0) / 100);
  res.locals.campaign = {
    bankName: process.env.BANK_NAME || '',
    accountName: process.env.BANK_ACCOUNT_NAME || '',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || ''
  };
  res.locals.flash = req.session.flash || null;
  res.locals.admin = null;
  delete req.session.flash;
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const supplied = req.body && req.body._csrf;
    const expected = req.session.csrfToken;
    if (typeof supplied !== 'string' || supplied.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      return res.status(403).render('error', { title: 'Request expired', message: 'Please reload the page and try again.' });
    }
  }
  next();
});

const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });

async function getRaisedByItem(items) {
  if (!items.length) return {};
  const totals = await Contribution.aggregate([
    { $match: { item: { $in: items.map((item) => item._id) }, status: 'verified' } },
    { $group: { _id: '$item', total: { $sum: '$amountKobo' } } }
  ]);
  return Object.fromEntries(totals.map((entry) => [String(entry._id), entry.total]));
}

async function requireAdmin(req, res, next) {
  if (!req.session.adminId) return res.redirect('/admin/login');
  try {
    const admin = await Admin.findById(req.session.adminId).select('email').lean();
    if (!admin) {
      req.session.destroy(() => {});
      return res.redirect('/admin/login');
    }
    res.locals.admin = admin;
    next();
  } catch (error) { next(error); }
}

app.get('/', asyncRoute(async (req, res) => {
  const items = await Item.find({ status: 'active' }).sort({ createdAt: -1 }).lean();
  const raisedByItem = await getRaisedByItem(items);
  const totalRaised = Object.values(raisedByItem).reduce((sum, amount) => sum + amount, 0);
  res.render('home', { title: 'Help open Luxe Salon', items, raisedByItem, totalRaised });
}));

app.get('/support/:id', asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('error', { title: 'Item not found', message: 'That fundraiser item could not be found.' });
  const item = await Item.findOne({ _id: req.params.id, status: 'active' }).lean();
  if (!item) return res.status(404).render('error', { title: 'Item not found', message: 'That fundraiser item is not available.' });
  const totals = await getRaisedByItem([item]);
  res.render('support', { title: `Support ${item.title}`, item, raised: totals[String(item._id)] || 0, error: null, values: {} });
}));

app.post('/support/:id', asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('error', { title: 'Item not found', message: 'That fundraiser item could not be found.' });
  const item = await Item.findOne({ _id: req.params.id, status: 'active' }).lean();
  if (!item) return res.status(404).render('error', { title: 'Item not found', message: 'That fundraiser item is not available.' });
  const values = {
    donorName: String(req.body.donorName || '').trim().slice(0, 100),
    donorEmail: String(req.body.donorEmail || '').trim().toLowerCase().slice(0, 254),
    amount: String(req.body.amount || '').trim(),
    transferReference: String(req.body.transferReference || '').trim().slice(0, 120)
  };
  const amount = Number(values.amount);
  const amountKobo = Math.round(amount * 100);
  const validEmail = !values.donorEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.donorEmail);
  if (!Number.isFinite(amount) || amountKobo < 100 || amountKobo > 100000000000 || !validEmail) {
    const totals = await getRaisedByItem([item]);
    return res.status(400).render('support', { title: `Support ${item.title}`, item, raised: totals[String(item._id)] || 0, error: 'Enter a valid amount of at least 1 and a valid email address (if provided).', values });
  }
  const contribution = await Contribution.create({
    item: item._id,
    donorName: values.donorName || 'Anonymous supporter',
    donorEmail: values.donorEmail,
    amountKobo,
    transferReference: values.transferReference,
    paymentCode: Contribution.createPaymentCode()
  });
  res.render('pledge-created', { title: 'Your support pledge', contribution, item });
}));

app.get('/contribution-status', (req, res) => res.render('lookup', { title: 'Check contribution status', result: null, error: null }));
app.post('/contribution-status', asyncRoute(async (req, res) => {
  const code = String(req.body.paymentCode || '').trim().toUpperCase();
  const result = code ? await Contribution.findOne({ paymentCode: code }).populate('item', 'title').lean() : null;
  res.render('lookup', {
    title: 'Check contribution status',
    result,
    error: result ? null : 'We could not find a contribution with that reference. Check the code and try again.'
  });
}));

app.get('/admin/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin sign in', error: null });
});
app.post('/admin/login', loginLimiter, asyncRoute(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).render('admin/login', { title: 'Admin sign in', error: 'Email or password is incorrect.' });
  }
  req.session.regenerate((error) => {
    if (error) return res.status(500).render('error', { title: 'Sign in failed', message: 'Please try again.' });
    req.session.adminId = String(admin._id);
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    res.redirect('/admin');
  });
}));
app.post('/admin/logout', requireAdmin, (req, res) => req.session.destroy(() => res.redirect('/')));

app.get('/admin', requireAdmin, asyncRoute(async (req, res) => {
  const [items, pendingCount, verifiedTotal] = await Promise.all([
    Item.find().sort({ updatedAt: -1 }).lean(),
    Contribution.countDocuments({ status: 'pending' }),
    Contribution.aggregate([{ $match: { status: 'verified' } }, { $group: { _id: null, total: { $sum: '$amountKobo' } } }])
  ]);
  const raisedByItem = await getRaisedByItem(items);
  res.render('admin/dashboard', { title: 'Admin dashboard', items, raisedByItem, pendingCount, verifiedTotal: verifiedTotal[0]?.total || 0 });
}));

app.get('/admin/items/new', requireAdmin, (req, res) => res.render('admin/item-form', { title: 'Add fundraiser item', item: null, error: null }));
app.post('/admin/items', requireAdmin, asyncRoute(async (req, res) => {
  const data = itemFormData(req.body);
  const error = validateItem(data);
  if (error) return res.status(400).render('admin/item-form', { title: 'Add fundraiser item', item: data, error });
  await Item.create(data);
  req.session.flash = { type: 'success', message: 'Fundraiser item added.' };
  res.redirect('/admin');
}));
app.get('/admin/items/:id/edit', requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('error', { title: 'Item not found', message: 'That item could not be found.' });
  const item = await Item.findById(req.params.id).lean();
  if (!item) return res.status(404).render('error', { title: 'Item not found', message: 'That item could not be found.' });
  res.render('admin/item-form', { title: 'Edit fundraiser item', item, error: null });
}));
app.post('/admin/items/:id', requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('error', { title: 'Item not found', message: 'That item could not be found.' });
  const data = itemFormData(req.body);
  const error = validateItem(data);
  if (error) return res.status(400).render('admin/item-form', { title: 'Edit fundraiser item', item: { ...data, _id: req.params.id }, error });
  await Item.findByIdAndUpdate(req.params.id, data, { runValidators: true });
  req.session.flash = { type: 'success', message: 'Fundraiser item updated.' };
  res.redirect('/admin');
}));

app.get('/admin/contributions', requireAdmin, asyncRoute(async (req, res) => {
  const status = ['pending', 'verified', 'rejected'].includes(req.query.status) ? req.query.status : 'pending';
  const contributions = await Contribution.find({ status }).populate('item', 'title').sort({ createdAt: -1 }).lean();
  res.render('admin/contributions', { title: 'Review contributions', contributions, status });
}));
app.post('/admin/contributions/:id/status', requireAdmin, asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('error', { title: 'Contribution not found', message: 'That contribution could not be found.' });
  const status = String(req.body.status || '');
  if (!['verified', 'rejected', 'pending'].includes(status)) return res.status(400).render('error', { title: 'Invalid status', message: 'Choose a valid contribution status.' });
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) return res.status(404).render('error', { title: 'Contribution not found', message: 'That contribution could not be found.' });
  contribution.status = status;
  contribution.verifiedAt = status === 'verified' ? new Date() : null;
  contribution.adminNote = String(req.body.adminNote || '').trim().slice(0, 500);
  await contribution.save();
  req.session.flash = { type: 'success', message: `Contribution ${status}.` };
  res.redirect(`/admin/contributions?status=${status === 'pending' ? 'pending' : status}`);
}));

function itemFormData(body) {
  const amount = Number(String(body.targetAmount || '').trim());
  return {
    title: String(body.title || '').trim().slice(0, 120),
    description: String(body.description || '').trim().slice(0, 2000),
    targetAmountKobo: Number.isFinite(amount) ? Math.round(amount * 100) : 0,
    status: ['draft', 'active', 'funded', 'purchased', 'archived'].includes(body.status) ? body.status : 'draft',
    imageUrl: String(body.imageUrl || '').trim().slice(0, 500)
  };
}
function validateItem(item) {
  if (!item.title || !item.description) return 'Add a title and description.';
  if (!Number.isSafeInteger(item.targetAmountKobo) || item.targetAmountKobo < 100) return 'Target amount must be at least 1.';
  if (item.imageUrl && !/^https:\/\//i.test(item.imageUrl)) return 'Image URL must start with https://.';
  return null;
}

app.use((req, res) => res.status(404).render('error', { title: 'Page not found', message: 'The page you requested does not exist.' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).render('error', { title: 'Something went wrong', message: 'Please try again later.' });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const existing = await Admin.findOne({ email });
    if (!existing && (process.env.ADMIN_PASSWORD.length < 12)) {
      throw new Error('ADMIN_PASSWORD must be at least 12 characters when creating the initial admin.');
    }
    if (!existing) {
      await Admin.create({ email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) });
      console.log(`Created initial admin account for ${email}`);
    }
  }
  app.listen(PORT, () => console.log(`Luxe Salon fundraiser listening on port ${PORT}`));
}

start().catch((error) => { console.error('Unable to start application:', error); process.exit(1); });
