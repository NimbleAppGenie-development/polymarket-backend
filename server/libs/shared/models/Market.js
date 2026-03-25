const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");
class Market extends Model {}

Market.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.JSON,
    status: {
        type: DataTypes.STRING,
        defaultValue: "ACTIVE"
    },
    homeTabView: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize,
    tableName: "markets",
    timestamps: true
});

module.exports = Market;