export default (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        EventId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Name: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        Description: {
            type: Sequelize.STRING(4000),
            allowNull: false
        },
        Location: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        Date: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });
    return Book;
};