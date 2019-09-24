'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Events',
    [
      {
        Name: 'DevDay Johannesburg',
        Description: 'DevDay Barnyard Rivonia',
        Location: 1,
        Date: '2019-10-10',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Events', null, {})
};
