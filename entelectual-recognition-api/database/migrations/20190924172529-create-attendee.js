'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Attendees', {
      AttendeeId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      EventId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      Username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
        return queryInterface.addConstraint('Attendees', ['AttendeeId', 'EventId', 'Username'], {
        type: 'primary key',
        name: 'composite_primary_key'
      });
    });   
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Attendees');
  }
};