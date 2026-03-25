const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");

class PredictionResult extends Model { }

PredictionResult.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    questionId: DataTypes.UUID,
    winningOptionId: DataTypes.UUID,
    totalPool: DataTypes.DECIMAL(10, 2),
    platformFee: DataTypes.DECIMAL(10, 2),
    distributedAmount: DataTypes.DECIMAL(10, 2),
    status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING"
    }
}, {
    sequelize,
    tableName: "prediction_results",
    timestamps: true
});

module.exports = PredictionResult;