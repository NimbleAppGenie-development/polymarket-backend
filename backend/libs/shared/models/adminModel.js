const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require(".");

class Admin extends Model {
    async generateToken() {
        const secretName = process.env.SECRET_NAME;

        let JWT_SECRET_KEY;
        let JWT_REFRESH_SECRET_KEY;

        try {
            JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "abcdefghijklmnopqrstuvwxyz";
            JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "abcdefghijklmnopqrstuvwxyz";
        } catch (error) {
            console.warn("Failed to fetch secrets, using static env values.");
            JWT_SECRET_KEY = "abcdefghijklmnopqrstuvwxyz";
            JWT_REFRESH_SECRET_KEY = "abcdefghijklmnopqrstuvwxyz";
        }

        const accessToken = jwt.sign(
            {
                id: this.id,
                role: this.role,
                tokenVersion: this.tokenVersion,
            },
            JWT_SECRET_KEY,
            { expiresIn: "11d" },
        );

        const refreshToken = jwt.sign(
            {
                id: this.id,
                role: this.role,
                tokenVersion: this.tokenVersion,
            },
            JWT_REFRESH_SECRET_KEY,
            { expiresIn: "31d" },
        );

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        await this.save();
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
        return this.refreshToken === token;
    }
}

Admin.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        fullName: { type: DataTypes.STRING, allowNull: true },
        //currency: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
        // wallet: { type: DataTypes.STRING },
        profileImage: { type: DataTypes.STRING, defaultValue: "" },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            set(value) {
                this.setDataValue("email", value.toLowerCase());
            },
        },
        emailOTP: { type: DataTypes.STRING, defaultValue: "" },
        password: { type: DataTypes.STRING },
        isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        role: {
            type: DataTypes.ENUM("admin"),
            defaultValue: "admin",
        },
        walletBalance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0
        },

        accessToken: { type: DataTypes.TEXT },
        refreshToken: { type: DataTypes.TEXT },
        tokenVersion: { type: DataTypes.TEXT, defaultValue: "" },
    },
    {
        sequelize: sequelize,
        modelName: "Admin",
        tableName: "admin",
        timestamps: true,
        hooks: {
            beforeSave: async (admin) => {
                if (admin.changed("password")) {
                    await admin.hashPassword();
                }
            },
        },
    },
);

module.exports = Admin;
