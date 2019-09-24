'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Locations',
    [
      {
        name: 'Johannesburg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cape Town',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Locations', null, {})
};
