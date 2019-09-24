'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    EventId: { 
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: DataTypes.STRING,
    Description: DataTypes.STRING,
    Location: DataTypes.INTEGER,
    Date: DataTypes.DATE
  }, {});
  Event.associate = function(models) {
    Event.hasMany(models.Event, {
      foreignKey: 'EventId',
      as: 'events',
      onDelete: 'RESTRICT',
    });

    Event.hasMany(models.Location, {
      foreignKey: 'LocationId',
      as: 'locations',
      onDelete: 'RESTRICT',
    });
  };
  return Event;
};