require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Package = require('../models/Package');
const Gallery = require('../models/Gallery');

const connectDB = require('../config/db');

const packages = [
  {
    name: 'ROYAL SIGNATURE PACKAGE #01',
    price: 150000,
    duration: 'Two Days',
    description: 'Luxurious wedding & homecoming full day photography package.',
    features: [
      'Two Days Full Coverage (Wedding Day & Homecoming)',
      '+ Free Pre-Shoot',
      'Premium 12×30 or 16×24 Magazine Album (50-60 Pages) with Custom Box',
      'Premium 8×24 preshoot Album (10-12 Pages)',
      '20×30 Enlargement',
      '16×24 Enlargement 03',
      'Thank You Card 150',
      'Pen Drive',
      'All High-Resolution Edited Photos Provided in a Pen Drive'
    ],
    is_popular: true,
    sort_order: 1,
  },
  {
    name: 'PLATINUM ELEGANCE PACKAGE #02',
    price: 120000,
    duration: 'Two Days',
    description: 'Premium wedding & homecoming coverage with high-end magazine album.',
    features: [
      'Two Days Full Coverage (Wedding & Homecoming)',
      'Free Pre-Shoot (Only One Location)',
      'Premium 12×30 Magazine Album (20-30 Page) with Box',
      '20×30 Enlargement 01',
      '16×24 Enlargement 01',
      'Thank You Card 150',
      'All High-Resolution Edited Photos (Soft Copy)'
    ],
    is_popular: false,
    sort_order: 2,
  },
  {
    name: 'CLASSIC STORYTELLER PACKAGE #03',
    price: 85000,
    duration: 'One Day',
    description: 'Classic wedding storytelling photography with magazine album and frames.',
    features: [
      'One Day Full Coverage (wedding Day Only)',
      'Standard 10×24 Magazine Album (25-30 Pages) with Box',
      '16×24 Premium Enlargement',
      '12×18 Table Wall Frames',
      'Thank You Card (5×7) 100',
      'High - Resolution Edited Photo (Soft Copy)'
    ],
    is_popular: false,
    sort_order: 3,
  },
  {
    name: 'ESSENTIAL HIGHLIGHTS PACKAGE #04',
    price: 45000,
    duration: 'One Day',
    description: 'Bespoke highlights event coverage with premium wall frames.',
    features: [
      'One Day Fully Coverage',
      '16×24 Premium Wall Frame 01',
      'Thank You Card (5×7 Size) 50',
      'All High- Resolution Edited Photos (Soft Copies)',
      '(Note: This Package Does Not Include A Printed Album)'
    ],
    is_popular: false,
    sort_order: 4,
  },
  {
    name: 'MINIMALIST PORTRAIT PACKAGE #05',
    price: 25000,
    duration: 'Couple Session',
    description: 'Minimalist portrait shoots focusing on aesthetics and couples.',
    features: [
      'Couple Portrait Session Only (Wedding & HomeComing Attires)',
      '16×24 Premium Wall Frame 01',
      '50-60 High End Retouched Photos (Soft Copy)',
      '(Note: This Package Does Not Include A Printed Album, Thankyou Card)'
    ],
    is_popular: false,
    sort_order: 5,
  },
  {
    name: 'Gold Package (Birthday)',
    price: 15000,
    duration: 'Portrait Session',
    description: 'Standard birthday & portrait session package with digital delivery.',
    features: [
      '12×18 Photo Frame',
      'Portrait Session',
      'All High- Resolution Edited Photos (30-35 Soft Copies)'
    ],
    is_popular: false,
    sort_order: 6,
  },
];

// Unsplash placeholder images for gallery seeding (high-quality photography images)
const galleryImages = [
  { title: 'Wedding Ceremony', category: 'wedding', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
  { title: 'Wedding Reception', category: 'wedding', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800' },
  { title: 'Birthday Celebration', category: 'birthday', image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800' },
  { title: 'Graduation Day', category: 'graduation', image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800' },
  { title: 'Corporate Event', category: 'commercial', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
  { title: 'Nature Portrait', category: 'nature', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
  { title: 'Portrait Session', category: 'portraits', image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800' },
  { title: 'Event Photography', category: 'events', image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' },
  { title: 'Outdoor Couple', category: 'outdoor', image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800' },
  { title: 'Wedding Vows', category: 'wedding', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', is_featured: true },
  { title: 'Mountain Landscape', category: 'nature', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800' },
  { title: 'Product Photography', category: 'commercial', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Package.deleteMany({});
    await Gallery.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'DarkLight Admin',
      email: 'admin@darklight.com',
      phone: '+1 (555) 000-0001',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email} / admin123`);

    // Create sample customer
    const customer = await User.create({
      name: 'Sarah Johnson',
      email: 'customer@example.com',
      phone: '+1 (555) 123-4567',
      password: 'customer123',
      role: 'customer',
    });
    console.log(`👤 Customer created: ${customer.email} / customer123`);

    // Create packages
    const createdPackages = await Package.insertMany(packages);
    console.log(`📦 Created ${createdPackages.length} packages`);

    // Create gallery images
    const createdImages = await Gallery.insertMany(galleryImages);
    console.log(`🖼️  Created ${createdImages.length} gallery images`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:    admin@darklight.com / admin123');
    console.log('   Customer: customer@example.com / customer123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
