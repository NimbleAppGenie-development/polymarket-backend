const { DataTypes, Model } = require("sequelize");
const sequelize = require("."); // Assuming this is your Sequelize instance
const Category = require("./Category");
const QuestionOption = require("./questionOption");

class Question extends Model {}

Question.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.UUID, // UUID to category
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        marketRules: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isTrending: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Question",
        tableName: "questions",
        timestamps: true,
    },
);

Question.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Question.hasMany(QuestionOption, { foreignKey: "questionId", as: "options" });
module.exports = Question;
