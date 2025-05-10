const httpStatus = require("http-status");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const Blog = require("../../models/blog.model");
const sequelize = require("../../db");
const { Sequelize, where, Op, literal, fn, col } = require("sequelize");
const MasterAttributeValue = require("../../models/master-attribute-value.model");
const MasterAttributeModule = require("../../models/master-attribute.model");
const createHttpError = require("http-errors");
const { query } = require("express");
const BlogComments = require("../../models/blog-comment.model");
const User = require("../../models/user.model");
const { search } = require("../../routes/api/blog.route");
const uploadPath = "uploads/blogs";
const uploadCarousel = "uploads/blogs/carousel";

exports.fetchBlogs = asyncErrorHandler(async (req, res) => {
  const { slug: blogSlug, query: querySlug, search } = req.query;

  const masterAttributeIds = await MasterAttributeModule.findOne({
    where: { slug: "blog-category" },
  });

  const masterAttributeTypeIds = await MasterAttributeModule.findOne({
    where: { slug: "blog-type" },
  });

  const masterAttrValues = await MasterAttributeValue.findAll({
    where: { master_attribute_id: masterAttributeIds.id },
    attributes: ["id", "value", "slug"],
    ...(blogSlug && { where: { slug: blogSlug } }),
  });

  const masterAttrTypeValues = await MasterAttributeValue.findAll({
    where: { master_attribute_id: masterAttributeTypeIds.id },
    attributes: ["id", "value", "slug"],
    ...(querySlug && { where: { slug: querySlug } }),
  });

  if (querySlug) {
    const masterAttrValues = await MasterAttributeValue.findAll({
      where: { master_attribute_id: masterAttributeIds.id },
      attributes: ["id", "value", "slug"],
      ...(blogSlug && { where: { slug: blogSlug } }),
    });

    blogsData = await Promise.all(
      masterAttrTypeValues?.map(async (mAttr) => {
        const { id } = mAttr;
        const blogs = await Blog.findAll({
          attributes: [
            "id",
            "title",
            "slug",
            "category",
            "short_description",
            "created_at",
            [
              literal(
                `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
              ),
              "image",
            ],
          ],
          where: {
            type: { [Op.eq]: id },
            ...(search && {
              [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }],
            }),
          },
          order: [["created_at", "DESC"]],
        });

        if (blogs.length > 0) {
          const filteredBlogs = blogs.filter((blog) =>
            blog.category.some((category) =>
              masterAttrValues.some(
                (masterAttr) =>
                  masterAttr.slug === category || masterAttr.id === category
              )
            )
          );

          if (filteredBlogs.length > 0) {
            mAttr.setDataValue("childrens", filteredBlogs);
            return mAttr;
          }
        }
        return null;
      })
    );

    blogsData = blogsData.filter((blogsData) => Boolean(blogsData));
  } else {
    blogsData = await Promise.all(
      masterAttrValues?.map(async (mAttr) => {
        const { id } = mAttr;
        const blogs = await Blog.findAll({
          attributes: [
            "id",
            "title",
            "slug",
            "short_description",
            "created_at",
            [
              literal(
                `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
              ),
              "image",
            ],
          ],
          where: {
            category: { [Op.contains]: [id] },
            ...(search && {
              [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }],
            }),
          },
          order: [["created_at", "DESC"]],
        });
        if (blogs.length > 0) {
          mAttr.setDataValue("childrens", blogs);
          return mAttr;
        }
      })
    );

    blogsData = blogsData.filter((blogsData) => Boolean(blogsData));
  }
  res.status(httpStatus.OK).json({
    success: true,
    data: blogsData,
  });
});

exports.fetchBlogsList = asyncErrorHandler(async (req, res) => {
  const {
    slug: blogSlug,
    query: querySlug,
    search,
    page = 1,
    limit = 8,
  } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * pageSize;

  // Get category and type master attributes
  const masterAttributeIds = await MasterAttributeModule.findOne({
    where: { slug: "blog-category" },
  });

  const masterAttributeTypeIds = await MasterAttributeModule.findOne({
    where: { slug: "blog-type" },
  });

  // Get blog categories
  const masterAttrValues = await MasterAttributeValue.findAll({
    where: {
      master_attribute_id: masterAttributeIds.id,
      ...(blogSlug && { slug: blogSlug }),
    },
    attributes: ["id", "value", "slug"],
  });

  // Get blog types
  const masterAttrTypeValues = await MasterAttributeValue.findAll({
    where: {
      master_attribute_id: masterAttributeTypeIds.id,
      ...(querySlug && { slug: querySlug }),
    },
    attributes: ["id", "value", "slug"],
  });

  let blogsData = [];

  if (querySlug) {
    // Filtering blogs by type
    const fetchedBlogs = await Promise.all(
      masterAttrTypeValues.map(async (mAttr) => {
        const { id } = mAttr;
        const blogs = await Blog.findAll({
          attributes: [
            "id",
            "title",
            "slug",
            "category",
            "short_description",
            "created_at",
            [
              literal(
                `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
              ),
              "image",
            ],
          ],
          where: {
            type: { [Op.eq]: id },
            ...(search && {
              [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }],
            }),
          },
          order: [["created_at", "DESC"]],
          group: ["id"], // Ensures unique results from DB
        });

        // Filter blogs matching category
        return blogs.filter((blog) =>
          blog.category.some((category) =>
            masterAttrValues.some(
              (masterAttr) =>
                masterAttr.slug === category || masterAttr.id === category
            )
          )
        );
      })
    );

    blogsData = fetchedBlogs.flat(); // Flatten nested arrays
  } else {
    // Filtering blogs by category
    const fetchedBlogs = await Promise.all(
      masterAttrValues.map(async (mAttr) => {
        const { id } = mAttr;
        return await Blog.findAll({
          attributes: [
            "id",
            "title",
            "slug",
            "short_description",
            "created_at",
            [
              literal(
                `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
              ),
              "image",
            ],
          ],
          where: {
            category: { [Op.contains]: [id] },
            ...(search && {
              [Op.or]: [{ title: { [Op.iLike]: `%${search}%` } }],
            }),
          },
          order: [["created_at", "DESC"]],
          group: ["id"], // Ensures unique results from DB
        });
      })
    );

    blogsData = fetchedBlogs.flat(); // Flatten nested arrays
  }

  // **Remove duplicates based on unique blog ID**
  const uniqueBlogs = [];
  const blogIds = new Set();

  blogsData.forEach((blog) => {
    if (!blogIds.has(blog.id)) {
      blogIds.add(blog.id);
      uniqueBlogs.push(blog);
    }
  });

  // **Apply pagination after removing duplicates**
  const paginatedBlogs = uniqueBlogs.slice(offset, offset + pageSize);

  // **Check if more blogs are available**
  const hasMore = offset + pageSize < uniqueBlogs.length;

  res.status(httpStatus.OK).json({
    success: true,
    data: paginatedBlogs,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      hasMore,
    },
  });
});

exports.fetchBlogData = asyncErrorHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({
    attributes: {
      include: [
        [
          literal(
            `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
          ),
          "image",
        ],
        [
          literal(
            `CASE WHEN thumb_image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', thumb_image) ELSE NULL END`
          ),
          "thumb_image",
        ],
        [
          literal(
            `CASE WHEN carousel_image IS NOT NULL 
              THEN ARRAY(SELECT concat('${req.app.locals.baseurl}/${uploadCarousel}/', unnest(carousel_image)))
              ELSE ARRAY[]::text[] 
            END`
          ),
          "carousel_image",
        ],
      ],
    },
    where: { slug },
  });

  if (!blog) throw createHttpError(httpStatus.NOT_FOUND, "Data not found!");

  let authorName = null;
  let authorSlug = null;
  if (blog.blog_author_id) {
    const author = await MasterAttributeValue.findOne({
      where: { id: blog.blog_author_id },
      attributes: ["value", "slug"],
    });
    authorName = author ? author.value : null;
    authorSlug = author ? author.slug : null;
  }

  const blogData = {
    ...blog.toJSON(),
    author_name: authorName,
    author_slug: authorSlug,
  };

  res.status(httpStatus.OK).json({
    success: true,
    data: blogData,
  });
});

//comment on blog

const commentIncludeClause = (baseurl) => [
  {
    model: User,
    attributes: [
      [literal("CONCAT(first_name, ' ', last_name)"), "user_name"],
      [
        literal(
          `CASE WHEN image IS NOT NULL THEN 
          CONCAT('${baseurl}/uploads/users/', image) 
          ELSE NULL END`
        ),
        "image",
      ],
    ],
    required: false,
  },
];

const recursiveFindNestedComments = async (req, comment) => {
  try {
    const childComments = await BlogComments.findAll({
      where: { parent_comment_id: comment.id },
      include: commentIncludeClause(req.app.locals.baseurl),
    });

    comment.setDataValue("children", childComments);

    for (const childComment of childComments) {
      await recursiveFindNestedComments(req, childComment);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.fetchBlogCommentsBySlug = asyncErrorHandler(async (req, res) => {
  const { blog_slug } = req.params;

  const originalBlog = await Blog.findOne({
    attributes: ["id"],
    where: { slug: blog_slug },
  });

  let blogComments = await BlogComments.findAll({
    where: { blog_id: originalBlog.id, parent_comment_id: null },
    include: commentIncludeClause(req.app.locals.baseurl),
    order: [["created_at", "DESC"]],
  });

  blogComments = await Promise.all(
    blogComments.map(async (level0Comment) => {
      await recursiveFindNestedComments(req, level0Comment);
      return level0Comment;
    })
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: blogComments,
  });
});

exports.createComment = asyncErrorHandler(async (req, res) => {
  const { blog_slug } = req.body;
  const { id } = req.user;

  const blog = await Blog.findOne({ where: { slug: blog_slug } });

  const blogComment = await BlogComments.create({
    ...req.body,
    user_id: id,
    blog_id: blog.id,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: blogComment,
  });
});
