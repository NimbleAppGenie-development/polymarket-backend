const { DataTypes, Model } = require("sequelize");
const sequelize = require("."); 

class UserWallet extends Model {}

UserWallet.init(
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
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        balance: {  
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
    },
    {
        sequelize,
        modelName: "UserWallet",
        tableName: "userWallets",
        timestamps: true,
    },
);


UserWallet.associate = () => {
    const User = require("./user");

    UserWallet.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });
};

module.exports = UserWallet;
