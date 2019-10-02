'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Events',
    [
      {
        eventId: 1,
        name: 'DevDay Johannesburg',
        description: 'DevDay Johannesburg',
        location: 1,
        eventDate: '2019-10-10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        eventId: 2,
        name: 'DevDay Cape Town',
        description: 'DevDay Cape Town',
        location: 2,
        eventDate: '2019-10-03',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {
      ignoreDuplicates: true
    },
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Events', null, {})
};
