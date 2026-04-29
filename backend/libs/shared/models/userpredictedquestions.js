const { DataTypes, Model } = require("sequelize");
const sequelize = require("."); // Assuming this is your Sequelize instance
const Category = require("./Category"); // Assuming you have a User model
const Question = require("./question");

class UserPredictedQuestion extends Model {}

UserPredictedQuestion.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false 
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        selectedOptionId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        selectedOptionName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        multiplier: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        entryAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        winningCredited: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        winningStatus: {
            type: DataTypes.ENUM("WIN", "LOSS", "PENDING"),
            allowNull: false,
            defaultValue: "PENDING",
        },
    },
    {
        sequelize,
        modelName: "UserPredictedQuestion",
        tableName: "userPredictedQuestions",
        timestamps: true,
    },
);

UserPredictedQuestion.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
UserPredictedQuestion.belongsTo(Question, { foreignKey: "questionId", as: "question" });
module.exports = UserPredictedQuestion;
