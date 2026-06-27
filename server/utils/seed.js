require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Package = require('../models/Package');
const Gallery = require('../models/Gallery');

const connectDB = require('../config/db');

const packages = [
  {
    name: 'Basic',
    price: 100,
    duration: '2 Hours',
    description: 'Perfect for small events and personal photoshoots',
    features: [
      '2 Hours of Photography',
      '50+ Edited Photos',
      'Online Gallery',
      '1 Photographer',
      'Digital Downloads',
    ],
    is_popular: false,
    sort_order: 1,
  },
  {
    name: 'Standard',
    price: 250,
    duration: '5 Hours',
    description: 'Great for birthdays, graduations and medium events',
    features: [
      '5 Hours of Photography',
      '150+ Edited Photos',
      'Online Gallery',
      '1 Photographer',
      'Digital Downloads',
      'Print Rights',
      'Same-Day Previews',
    ],
    is_popular: true,
    sort_order: 2,
  },
  {
    name: 'Premium',
    price: 500,
    duration: 'Full Day',
    description: 'Complete coverage for weddings and large events',
    features: [
      'Full Day Coverage (8 Hours)',
      '300+ Edited Photos',
      'Online Gallery',
      '2 Photographers',
      'Digital Downloads',
      'Print Rights',
      'Same-Day Previews',
      'Photo Album (30 pages)',
      'Drone Photography',
      'Priority Editing (48h)',
    ],
    is_popular: false,
    sort_order: 3,
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
