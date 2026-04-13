const { DataTypes, Model } = require("sequelize");
const sequelize = require("."); // Assuming this is your Sequelize instance
const User = require("./user");
const Question = require("./question");

class Answer extends Model {}

Answer.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID, 
            allowNull: false,
        },
        questionId: {
            type: DataTypes.UUID, 
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Answer",
        tableName: "answers",
        timestamps: true,
    },
);
Answer.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

module.exports = Answer;
