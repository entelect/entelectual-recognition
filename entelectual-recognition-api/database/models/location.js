'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    locationId: { 
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, {});
  Location.associate = function(models) {
    Location.hasMany(models.Event, {
      foreignKey: 'eventId',
      as: 'events',
      onDelete: 'RESTRICT',
    });
  };
  return Location;
};