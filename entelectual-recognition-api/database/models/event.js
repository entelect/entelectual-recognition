'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventId: { 
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.INTEGER,
    eventDate: DataTypes.DATE
  }, {});
  Event.associate = function(models) {
    Event.hasMany(models.Event, {
      foreignKey: 'eventId',
      as: 'events',
      onDelete: 'RESTRICT',
    });

    Event.hasMany(models.Location, {
      foreignKey: 'locationId',
      as: 'locations',
      onDelete: 'RESTRICT',
    });
  };
  return Event;
};