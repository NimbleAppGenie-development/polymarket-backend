const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");
class Option extends Model {}

Option.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    questionId: DataTypes.UUID,
    title: DataTypes.STRING,
    odds: DataTypes.DECIMAL(10,2),
    currentPrice: DataTypes.DECIMAL(10,2),
    volume: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "ACTIVE"
    }
}, {
    sequelize,
    tableName: "options",
    timestamps: true
});

module.exports = Option;