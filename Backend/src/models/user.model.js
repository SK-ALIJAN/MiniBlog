const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        profession: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        otpExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
          },
    }, {
    timestamps: true,
}
);
module.exports = User;