const httpStatus = require("http-status");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const Blog = require("../../models/blog.model");
const sequelize = require("../../db");
const { Sequelize, where, Op, literal, fn, col } = require("sequelize");
const MasterAttributeValue = require("../../models/master-attribute-value.model");
const MasterAttributeModule = require("../../models/master-attribute.model");
const createHttpError = require("http-errors");
const { query } = require("express");
const uploadPath = "uploads/blogs";
const uploadCarousel = "uploads/blogs/carousel";


exports.fetchAuthorsBlogs = asyncErrorHandler(async (req, res) => {
  const { slug } = req.params;

  const {page,limit=8}=req.query;
  
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * pageSize;

   let hasMore = false;
  const masterAttributeIds = await MasterAttributeModule.findOne({
    where: { slug: "blog-author" },
  });
  const masterAttrValues = await MasterAttributeValue.findOne({
    where: { master_attribute_id: masterAttributeIds.id, slug: slug },
    attributes: ["id", "value", "slug"],
  });
  if(masterAttrValues){
    const blogs = await Blog.findAll({
      attributes: [
        "id",
        "title",
        "slug",
        "created_at",
        [
          literal(
            `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
          ),
          "image",
        ],
      ],
      where: {
        blog_author_id: masterAttrValues.id,
        status:1,
      },
      order: [["id", "DESC"]],
    });  
    
    hasMore = offset + pageSize < blogs?.length;
    const newBlog=blogs.slice(offset, offset + pageSize);
    blogsData =  {"author_name": masterAttrValues.value, "blogs": newBlog};
  } else {  
    blogsData = {"author_name": "", "blogs": []};
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: blogsData,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      hasMore,
    },
  });
});