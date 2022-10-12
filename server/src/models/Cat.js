module.exports = ( sequelize, DataTypes ) => {
    const Cat = sequelize.define('Cat', {
        brand: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        pictures: DataTypes.STRING,
        about: DataTypes.TEXT,
        category: DataTypes.STRING,
        price: DataTypes.STRING,
    })
    return Cat
}