const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");
class Question extends Model {}

Question.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    marketId: DataTypes.UUID,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    status: {
        type: DataTypes.STRING,
        defaultValue: "OPEN"
    },
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    resolutionTime: DataTypes.DATE,
    winningOptionId: DataTypes.UUID,
    totalVolume: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: "questions",
    timestamps: true
});

module.exports = Question;