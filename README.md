# Luxe Salon fundraiser MVP

This branch converts the static Luxe Salon site into an EJS/Express fundraiser MVP. Supporters can browse active salon wishlist items, create a bank-transfer pledge, and privately look up its status. The authenticated admin can manage items and manually verify/reject contributions. A pledge is **not a payment**: public totals include only contributions an admin marks verified.

## Requirements
- Node.js 20+
- MongoDB (local or hosted)

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, a long random `SESSION_SECRET`, and `ADMIN_EMAIL` / `ADMIN_PASSWORD` (at least 12 characters).
3. Set bank details only if you are ready to display them after a supporter creates a pledge. Use a dedicated business account where possible.
4. `npm run dev` (or `npm start`) and open `http://localhost:3000`.
5. Sign in at `/admin`. The initial admin is created once at startup if that email is not already registered. Changing the environment password does not reset an existing admin password.
6. Add an item and set its status to **Active** to show it publicly.

## Image uploads
Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env` (or configure `CLOUDINARY_URL`) to enable uploads. Admins can upload JPEG, PNG, or WebP item photos up to 5 MB. Supporters can upload payment proof from the pledge confirmation page after transferring; proofs use authenticated Cloudinary delivery and are available as signed links in the admin contribution review.

## Manual transfer workflow
1. A supporter chooses an active item, enters an amount, and submits a pledge.
2. The app creates a private `LUXE-...` contribution reference and shows the configured transfer instructions.
3. The supporter uses that code as transfer narration and can check status at `/contribution-status`.
4. The admin checks the actual bank account independently, then verifies or rejects the pending contribution under `/admin/contributions`.
5. Only verified contributions are included in public totals. Admins can update item status to Funded or Purchased and edit the item description to post progress.

## Deployment/security notes
- Set `NODE_ENV=production`, HTTPS, a strong unique `SESSION_SECRET`, and a protected MongoDB URI in your host's secret manager. Never commit `.env`.
- Configure a reliable MongoDB backup and restrict database/network access. Use a dedicated admin email and password manager.
- Bank details are displayed to anyone who creates a pledge; do not use personal details you do not want public. Confirm transfers in the bank account—screenshots and donor-supplied references are not proof.
- This MVP intentionally does not process card payments, send email, support multiple admins, or offer automatic provider webhook verification. For online payments, integrate a provider such as Paystack/Flutterwave server-side and verify signed webhooks before marking a contribution paid. Consider legal/tax and privacy requirements for your location.
- The app uses a session-bound CSRF token, secure cookie flags, Helmet headers, login rate limiting, hashed admin passwords, and escaped EJS output. Review hosting-specific proxy/session settings before production.

The original static files remain in the repository; the Express server serves the new EJS app at `/` and existing files under `/assets`.
