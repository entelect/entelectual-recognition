export default (sequelize, DataTypes) => {
    const Attendee = sequelize.define('Attendee', {
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
    return Book;
};