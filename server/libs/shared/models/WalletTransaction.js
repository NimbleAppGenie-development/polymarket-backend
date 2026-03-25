class WalletTransaction extends Model {}

WalletTransaction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: DataTypes.UUID,
    type: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10,2),
    balanceAfter: DataTypes.DECIMAL(10,2),
    referenceId: DataTypes.UUID,
    transactionType: DataTypes.STRING,
    status: DataTypes.STRING
}, {
    sequelize,
    tableName: "wallet_transactions",
    timestamps: true
});

module.exports = WalletTransaction;