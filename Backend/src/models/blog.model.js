const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Blog = sequelize.define(
  "blog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    promotion_link: { type: DataTypes.STRING, allowNull: true },
    thumb_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blog_author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    author_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    long_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    short_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-Active 0-Inactive",
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    carousel_image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: "When blog type is hot takes upload carousel images"
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    //===========SEO============
    // meta tags
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },

    // Open Graph (OG) Tags (Facebook, LinkedIn, Instagram)
    og_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    og_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    og_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "website", // Default to "website"
    },
    og_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    og_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Twitter Card Tags
    twitter_card: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "summary_large_image",
    },
    twitter_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    twitter_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter_site: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Blog;
