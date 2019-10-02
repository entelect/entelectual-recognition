'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Locations',
    [
      {
        locationId: 1,
        name: 'Johannesburg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        locationId: 2,
        name: 'Cape Town',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {
      ignoreDuplicates: true
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Locations', null, {})
};
