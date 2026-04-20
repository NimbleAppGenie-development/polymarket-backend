const { DataTypes, Model } = require("sequelize");
const sequelize = require("./index");

class fieldData extends Model { }

fieldData.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  {
    sequelize,
    timestamps: true, // manages createdAt & updatedAt automatically
    tableName: "fieldData",
  }
);

module.exports = fieldData;
