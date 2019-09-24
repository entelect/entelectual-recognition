'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Events',
    [
      {
        name: 'DevDay Johannesburg',
        description: 'DevDay Barnyard Rivonia',
        location: 1,
        eventDate: '2019-10-10',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Events', null, {})
};
