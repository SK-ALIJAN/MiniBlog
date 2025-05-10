const sequelize = require("../db");
const DataTypes = require("sequelize");
const Blog = require("../models/blog.model");
const User = require("./user.model");


const BlogComments = sequelize.define(
    "BlogComments",
    {
        comment_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        blog_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        parent_comment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        like: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

Blog.hasMany(BlogComments, {
    foreignKey: "blog_id",
    onDelete: "CASCADE"
})

BlogComments.belongsTo(Blog, {
    foreignKey: "blog_id"
})

User.hasMany(BlogComments, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
})
BlogComments.belongsTo(User, {
    foreignKey: "user_id"
})

module.exports = BlogComments;