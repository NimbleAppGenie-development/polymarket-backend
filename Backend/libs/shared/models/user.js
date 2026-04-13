const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require(".");

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
        name: { type: DataTypes.STRING, defaultValue: null },
        email: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING, defaultValue: null},
        password: { type: DataTypes.STRING },
        wallet: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
        accessToken: { type: DataTypes.STRING },
        refreshToken: { type: DataTypes.STRING },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
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
