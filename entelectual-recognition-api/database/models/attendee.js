'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define('Attendee', {
    AttendeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    EventId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Username: DataTypes.STRING
  }, {});
  Attendee.associate = function(models) {
    Location.hasMany(models.Event, {
      foreignKey: 'EventId',
      as: 'events',
      onDelete: 'RESTRICT',
    });
  };
  return Attendee;
};