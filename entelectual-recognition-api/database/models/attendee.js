'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define('Attendee', {
    attendeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {});
  Attendee.associate = function(models) {
    Attendee.hasMany(models.Event, {
      foreignKey: 'eventId',
      as: 'events',
      onDelete: 'RESTRICT',
    });
  };
  return Attendee;
};