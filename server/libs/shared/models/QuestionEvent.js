const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");

class QuestionEvent extends Model {}

QuestionEvent.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    questionId: DataTypes.UUID,
    eventType: DataTypes.STRING,
    data: DataTypes.JSONB
}, {
    sequelize,
    tableName: "question_events",
    timestamps: true
});

module.exports = QuestionEvent;