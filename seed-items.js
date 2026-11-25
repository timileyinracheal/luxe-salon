require('dotenv').config();

const mongoose = require('mongoose');
const Item = require('./models/FundraisingItem');

const amountInKobo = (naira) => naira * 100;

const items = [
  {
    title: 'Professional Styling Chair',
    description: 'An adjustable, salon-grade chair for comfortable styling and a polished client experience.',
    targetAmountKobo: amountInKobo(480000),
    status: 'active'
  },
  {
    title: 'Backwash Shampoo Unit',
    description: 'A reclining wash station with a basin for shampooing and hair treatments.',
    targetAmountKobo: amountInKobo(650000),
    status: 'active'
  },
  {
    title: 'Professional Hooded Dryer',
    description: 'A standing hooded dryer for setting styles and supporting salon treatments.',
    targetAmountKobo: amountInKobo(220000),
    status: 'active'
  },
  {
    title: 'Styling Mirror and Workstation',
    description: 'A full-length styling mirror with a practical workstation for tools and products.',
    targetAmountKobo: amountInKobo(280000),
    status: 'active'
  },
  {
    title: 'Opening Hair Care Stock',
    description: 'A starter supply of shampoos, conditioners, treatments, and styling products.',
    targetAmountKobo: amountInKobo(300000),
    status: 'active'
  }
];

async function seedItems() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Set MONGODB_URI in your environment before seeding fundraiser items.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const result = await Item.bulkWrite(items.map((item) => ({
      updateOne: {
        filter: { title: item.title },
        update: { $setOnInsert: item },
        upsert: true
      }
    })));
    console.log(`Inserted ${result.upsertedCount} fundraiser items; ${items.length - result.upsertedCount} already existed.`);
  } finally {
    await mongoose.disconnect();
  }
}

seedItems().catch((error) => {
  console.error('Unable to seed fundraiser items:', error.message);
  process.exitCode = 1;
});