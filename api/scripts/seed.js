'use strict';

/**
 * Seed script for development environment
 * 
 * This script creates sample data in Strapi for development purposes.
 * Run with: node scripts/seed.js (inside the Strapi container)
 * 
 * Or via: docker exec -it strapi-dev node scripts/seed.js
 */

const fs = require('fs');
const path = require('path');

async function seedDatabase(strapi) {
  console.log('🌱 Starting database seed...');

  // Check if data already exists
  const existingHeroes = await strapi.entityService.findMany('api::hero.hero');
  if (existingHeroes.length > 0) {
    console.log('⚠️  Data already exists, skipping seed. Delete existing data first if you want to reseed.');
    return;
  }

  // Create placeholder images directory
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Helper to create a placeholder image entry
  async function createPlaceholderMedia(name, width = 800, height = 600) {
    // Use a placeholder image service for dev
    const placeholderUrl = `https://placehold.co/${width}x${height}/2d5a3d/ffffff?text=${encodeURIComponent(name)}`;
    
    // For local dev, we'll create a file entry that points to an external URL
    // In production, you'd upload actual files
    const file = await strapi.plugins.upload.services.upload.upload({
      data: {},
      files: {
        path: placeholderUrl,
        name: `${name.toLowerCase().replace(/\s+/g, '-')}.png`,
        type: 'image/png',
        size: 1024,
      },
    }).catch(() => null);

    return file?.[0]?.id || null;
  }

  try {
    // Seed Hero
    console.log('📷 Creating Hero entry...');
    const hero = await strapi.entityService.create('api::hero.hero', {
      data: {
        publishedAt: new Date(),
      },
    });
    console.log(`   ✅ Hero created (ID: ${hero.id})`);
    console.log('   ⚠️  Note: You need to manually upload a Banner image in the admin panel');

    // Seed Team Members
    console.log('👥 Creating Team members...');
    const teamMembers = [
      { name: 'John Smith', role: 'Principal Geotechnical Engineer', email: 'john@example.com' },
      { name: 'Sarah Johnson', role: 'Senior Project Manager', email: 'sarah@example.com' },
      { name: 'Michael Chen', role: 'Site Engineer', email: 'michael@example.com' },
    ];

    for (const member of teamMembers) {
      const team = await strapi.entityService.create('api::team.team', {
        data: {
          ...member,
          publishedAt: new Date(),
        },
      });
      console.log(`   ✅ Team member "${member.name}" created (ID: ${team.id})`);
    }
    console.log('   ⚠️  Note: You need to manually upload team member images in the admin panel');

    // Seed Projects
    console.log('🏗️  Creating Projects...');
    const projects = [
      {
        title: 'Foundation Stabilization - Downtown Complex',
        description: 'Comprehensive ground stabilization project involving micropile installation and soil reinforcement for a 15-story commercial building. The project addressed settlement issues and provided long-term structural stability.',
        startDate: '2023-03-15',
        endDate: '2023-09-30',
      },
      {
        title: 'Slope Remediation - Hillside Development',
        description: 'Emergency slope stabilization project following heavy rainfall. Implemented soil nailing, retaining walls, and drainage solutions to prevent further erosion and protect adjacent properties.',
        startDate: '2023-06-01',
        endDate: '2023-12-15',
      },
    ];

    for (const project of projects) {
      const created = await strapi.entityService.create('api::project.project', {
        data: {
          ...project,
          publishedAt: new Date(),
        },
      });
      console.log(`   ✅ Project "${project.title}" created (ID: ${created.id})`);
    }
    console.log('   ⚠️  Note: You need to manually upload thumbnail, before, and after images in the admin panel');

    // Seed Documents
    console.log('📄 Creating Documents...');
    const documents = [
      {
        title: 'Geotechnical Investigation Standards',
        description: 'Comprehensive guide to site investigation procedures and soil testing methodologies.',
        url: 'https://example.com/geo-standards',
      },
      {
        title: 'Foundation Design Guidelines',
        description: 'Technical reference for foundation design in various soil conditions.',
        url: 'https://example.com/foundation-guide',
      },
    ];

    for (const doc of documents) {
      const created = await strapi.entityService.create('api::document.document', {
        data: {
          ...doc,
          publishedAt: new Date(),
        },
      });
      console.log(`   ✅ Document "${doc.title}" created (ID: ${created.id})`);
    }

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to Strapi Admin Panel: http://localhost:1337/admin');
    console.log('   2. Upload images for Hero banner, Team members, and Projects');
    console.log('   3. Refresh the frontend to see the content');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    throw error;
  }
}

module.exports = { seedDatabase };
