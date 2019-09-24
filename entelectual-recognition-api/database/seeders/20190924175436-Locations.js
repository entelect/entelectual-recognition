'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Locations',
    [
      {
        Name: 'Johannesburg',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Name: 'Cape Town',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Locations', null, {})
};
