const { DataTypes, Model } = require("sequelize");
const sequelize = require("."); // Assuming this is your Sequelize instance
const Question = require("./question");

class QuestionOption extends Model {}

QuestionOption.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        questionId: {
            type: DataTypes.UUID, // UUID to category
            allowNull: false
        },
        option: {
            type: DataTypes.STRING,
        },
        multiplier: {
            type: DataTypes.DECIMAL(10,2),  
        },
        resultStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
     {
        sequelize,
        modelName: "QuestionOption",
        tableName: "questionOptions",
        timestamps: true,
    }
);

// QuestionOption.belongsTo(Question, { foreignKey: "questionId", as: "question"});

QuestionOption.associate = () => {
    const Question = require("./question");

    QuestionOption.belongsTo(Question, {
        foreignKey: "questionId",
        as: "question"
    });
};
module.exports = QuestionOption;
