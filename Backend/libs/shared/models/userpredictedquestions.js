const { DataTypes, Model } = require("sequelize");
const sequelize = require("."); // Assuming this is your Sequelize instance
const Category = require("./Category"); // Assuming you have a User model
const Questions = require("./question");

class UserPredictedQuestion extends Model { }


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
            defaultValue: DataTypes.UUIDV4,
            allowNull: true,
        },
        categoryId: {
            type: DataTypes.UUID, // Assuming User.id is UUID to match
            references: {
                model: Category,
                key: "id",
            },
        },
        questionId: {
            type: DataTypes.UUID, // Assuming User.id is UUID to match
            references: {
                model: Questions,
                key: "id",
            },
        },
        selectedOption: {
            type: DataTypes.ENUM('optionA', 'optionB'),
        },
        pricePool: {
            type: DataTypes.STRING,
            allowNull: true
        },
        predictionAmount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        userWinning: {
            type: DataTypes.STRING,
            allowNull: true
        },
        winningCredited: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
    {
        sequelize,
        modelName: "UserPredictedQuestion",
        tableName: "userPredictedQuestions",
        timestamps: true,
    }

);

UserPredictedQuestion.belongsTo(Category, { foreignKey: "categoryId", as: "category_data" });
UserPredictedQuestion.belongsTo(Questions, { foreignKey: "questionId", as: "question" });
module.exports = UserPredictedQuestion;
