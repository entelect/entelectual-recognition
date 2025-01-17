'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Attendees', {
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
        return queryInterface.addConstraint('Attendees', ['eventId', 'username'], {
        type: 'primary key',
        name: 'composite_primary_key'
      });
    });   
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Attendees');
  }
};