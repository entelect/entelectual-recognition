'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    LocationId: { 
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Name: DataTypes.STRING
  }, {});
  Location.associate = function(models) {
    Location.hasMany(models.Event, {
      foreignKey: 'EventId',
      as: 'events',
      onDelete: 'RESTRICT',
    });
  };
  return Location;
};