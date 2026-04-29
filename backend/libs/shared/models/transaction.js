const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");
const User = require("@models/user")

class Transaction extends Model {}

Transaction.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        response: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
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
        },
    },
    {
        sequelize,
        tableName: "transactions",
        timestamps: true,
    },
);
Transaction.belongsTo(User, { foreignKey: "userId", as: "user", });
module.exports = Transaction;
