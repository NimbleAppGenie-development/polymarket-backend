const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");

class Category extends Model {}

Category.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: DataTypes.STRING,
    image: {
        type: DataTypes.STRING,
        defaultValue: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: "categories",
    timestamps: true
});

module.exports = Category;
