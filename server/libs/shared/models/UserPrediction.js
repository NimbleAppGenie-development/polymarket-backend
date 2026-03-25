class UserPrediction extends Model {}

UserPrediction.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: DataTypes.UUID,
    questionId: DataTypes.UUID,
    optionId: DataTypes.UUID,
    amount: DataTypes.DECIMAL(10,2),
    shares: DataTypes.DECIMAL(10,2),
    avgPrice: DataTypes.DECIMAL(10,2),
    potentialReward: DataTypes.DECIMAL(10,2),
    status: {
        type: DataTypes.STRING,
        defaultValue: "ACTIVE"
    }
}, {
    sequelize,
    tableName: "user_predictions",
    timestamps: true
});

module.exports = UserPrediction;