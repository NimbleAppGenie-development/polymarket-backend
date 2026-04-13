'use strict';

const { DataTypes, Model } = require("sequelize");
const sequelize = require(".");

class Page extends Model {}

Page.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        image: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
    },
    {
        sequelize: sequelize,
        timestamps: true,
        tableName: "pages",
    }
);

// 🔹 Export the function instead of a Promise
module.exports = Page;
