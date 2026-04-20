const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const sequelize = require(".");

dotenv.config();

class TempUser extends Model {
    async hashOtp() {
        if (!this.otp) {
            console.error("OTP is undefined or null");
            return;
        }
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
    }

    async verifyOtp(otp) {
        return await bcrypt.compare(otp, this.otp);
    }
}

TempUser.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        countryCode:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        countryShortName: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize: sequelize,
        modelName: "TempUser",
        tableName: "tempUsers",
        timestamps: true,
    }
);

// 🔹 Export a function that resolves to the initialized model
module.exports = TempUser;
