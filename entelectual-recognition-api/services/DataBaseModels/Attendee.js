export default (sequelize, DataTypes) => {
    const attendee = sequelize.define('Attendee', {
        AttendeeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        EventId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Username: {
            type: Sequelize.STRING(200),
            allowNull: false
        }
    });
    return attendee;
};