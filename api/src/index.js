'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Auto-seed database in development when SEED_DATABASE=true
    const shouldSeed = process.env.SEED_DATABASE === 'true' && process.env.NODE_ENV === 'development';
    
    if (shouldSeed) {
      console.log('\n🌱 SEED_DATABASE is enabled, checking if seeding is needed...\n');
      
      try {
        const { seedDatabase } = require('../scripts/seed');
        await seedDatabase(strapi);
      } catch (error) {
        console.error('Failed to run seed script:', error.message);
      }
    }
  },
};
