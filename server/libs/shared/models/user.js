const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require(".");
const Avatar = require("./avatar");

class User extends Model {

    async generateToken() {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

        this.tokenVersion = crypto.randomBytes(16).toString("hex");
        const accessToken = jwt.sign({ id: this.id, tokenVersion: this.tokenVersion }, JWT_SECRET_KEY, {
            expiresIn: "11d",
        });

        const refreshToken = jwt.sign({ id: this.id, tokenVersion: this.tokenVersion }, JWT_REFRESH_SECRET_KEY, {
            expiresIn: "31d",
        });

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        console.log("refresh======================", this.refreshToken);

        await this.save();
        await this.reload();
        return { accessToken, refreshToken };
    }

    async hashPassword() {
        if (!this.password) return;
        this.password = await bcrypt.hash(this.password, 10);
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    validateRefreshToken(token) {
        console.log("refreshToken---------", this.refreshToken);
        return this.refreshToken === token;
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        fullName: { type: DataTypes.STRING, defaultValue: null },
        countryCode: { type: DataTypes.STRING },
        phoneNumber: { type: DataTypes.STRING },
        gender: { type: DataTypes.STRING, defaultValue: null },
        dob: { type: DataTypes.DATE, defaultValue: null },
        currency: { type: DataTypes.STRING, defaultValue: null },
        wallet: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            set(value) {
                this.setDataValue("email", value.toLowerCase());
            },
        },
        address: { type: DataTypes.STRING, defaultValue: null },
        countryId: { type: DataTypes.STRING, defaultValue: null },
        stateId: { type: DataTypes.STRING, defaultValue: null },
        cityId: { type: DataTypes.STRING, defaultValue: null },
        zipCode: { type: DataTypes.STRING, defaultValue: null },
        deviceId: { type: DataTypes.STRING },
        deviceToken: { type: DataTypes.STRING },
        deviceType: { type: DataTypes.STRING },
        otp: { type: DataTypes.STRING, defaultValue: null },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
        isDeleteAccount: { type: DataTypes.BOOLEAN, defaultValue: false },
        isWhatsappMessagesAllow: { type: DataTypes.BOOLEAN, defaultValue: false },
        isAbove18: { type: DataTypes.BOOLEAN, defaultValue: false },
        isDiscoverable: { type: DataTypes.BOOLEAN, defaultValue: false },
        tokenVersion: { type: DataTypes.STRING, defaultValue: null },
        profileImage: { type: DataTypes.STRING, defaultValue: null },
        referralCode: { type: DataTypes.STRING, allowNull: true },
        referredBy: { type: DataTypes.STRING, allowNull: true },
        isNotificationEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
        isSmsNotificationsAllow: { type: DataTypes.BOOLEAN, defaultValue: false },
        countryShortName: { type: DataTypes.STRING, allowNull: true },
        kycStatus: { type: DataTypes.STRING, allowNull: true },
    },
    {
        sequelize: sequelize,
        tableName: "users",
        timestamps: true,
        hooks: {
            beforeSave: async (user) => {
                if (user.changed("password")) {
                    await user.hashPassword();
                }
            },
        },
    }
);

module.exports = User;
