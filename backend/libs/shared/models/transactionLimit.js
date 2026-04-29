const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");

class TransactionLimit extends Model {}

TransactionLimit.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    minWithdrawAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    maxWithdrawAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    tableName: "transactionLimits",
    timestamps: true,
});

module.exports = TransactionLimit;