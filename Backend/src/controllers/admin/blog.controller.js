const httpStatus = require("http-status");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const createHttpError = require("http-errors");
const Blog = require("../../models/blog.model");
const uploadFile = require("../../utils/uploadFile");
const { deleteFile } = require("../../utils/deleteFile");
const {
  getImageFormat,
  isBase64Image,
} = require("../../utils/imageTypeFromBase64");
const { literal } = require("sequelize");

const uploadPath = "uploads/blogs";
const uploadCarousel = "uploads/blogs/carousel";

const slugBuilder = (value) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/ /g, "-");
};

exports.fetchBlogs = asyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const blogData = await Blog.findAll({
    attributes: {
      include: [
        [
          literal(
            `(SELECT json_agg(value) FROM "master_attribute_values"  WHERE id = ANY(category::integer[]))`
          ),
          "category", // Alias for category names
        ],
        [
          literal(
            `CASE WHEN blog_author_id IS NOT NULL THEN (SELECT value from "master_attribute_values" WHERE id = blog_author_id) ELSE NULL END`
          ),
          "author_name", // Alias to avoid conflict with the original column name
        ],
        [
          literal(
            `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
          ),
          "image", // Alias to avoid conflict with the original column name
        ],
        [
          literal(
            `CASE WHEN thumb_image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', thumb_image) ELSE NULL END`
          ),
          "thumb_image", // Alias to avoid conflict with the original column name
        ],
      ],
    },
    limit: limit,
    offset: offset,
    order: [["updated_at", "DESC"]],
  });

  const totalCount = await Blog.count();
  res.status(httpStatus.OK).json({
    success: true,
    data: blogData,
    totalRecords: totalCount,
    message: "Blog list fetched successfully",
  });
});

exports.addBlogs = asyncErrorHandler(async (req, res) => {
  const {
    image,
    imageName,
    thumb_image,
    promotionImageName,
    carousel_image,
    ...restBody
  } = req.body;
  const { title } = restBody;

  const slug = slugBuilder(title);

  const isBlogExist = await Blog.count({
    where: {
      slug: slug,
    },
  });

  const blogSlug = isBlogExist > 0 ? `${slug}${isBlogExist + 1}` : slug;

  let fileName = null;
  let promotionFileName = null;

  if (imageName) fileName = await uploadFile(uploadPath, image, imageName);
  if (promotionImageName)
    promotionFileName = await uploadFile(
      uploadPath,
      thumb_image,
      promotionImageName
    );

  if (carousel_image && Array.isArray(carousel_image)) {
    // Upload new images (base64 format only)
    const updatedCarouselImages = await Promise.all(
      carousel_image.map(async (image, index) => {
        if (isBase64Image(image)) {
          const format = getImageFormat(image);
          const carouselImageName = `carouselImageName_${index}.${format}`;
          const uploadedImage = await uploadFile(
            "uploads/blogs/carousel",
            image,
            carouselImageName
          );
          return uploadedImage;
        }
        return image.split("/").pop();
      })
    );

    restBody.carousel_image = updatedCarouselImages;
  }

  const blog = await Blog.create({
    ...restBody,
    slug: blogSlug,
    ...(fileName && { image: fileName }),
    ...(promotionFileName && { thumb_image: promotionFileName }),
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: blog,
  });
});

exports.updateBlog = asyncErrorHandler(async (req, res) => {
  const {
    id,
    image,
    imageName,
    thumb_image,
    promotionImageName,
    carousel_image = [],
    ...restBody
  } = req.body;

  const { title } = restBody;

  const blogSlug = slugBuilder(title);

  let fileName = null;
  let promotionFileName = null;

  let blog = await Blog.findByPk(id);

  if (!blog) throw createHttpError(httpStatus.NOT_FOUND, "Blog doesn't exist");

  // Delete any removed carousel images
  carousel_image
    ?.filter((carImg) => !isBase64Image(carImg))
    ?.forEach((existingImage) => {
      if (!blog.carousel_image.includes(existingImage.split("/").pop()))
        deleteFile("uploads/blogs/carousel", existingImage);
    });

  // Handle main image
  if (imageName) {
    if (blog.image) deleteFile(uploadPath, blog.dataValues.image);
    fileName = await uploadFile(uploadPath, image, imageName); // Await the promise here
  }
  if (imageName === "" && blog.image) {
    deleteFile(uploadPath, blog.dataValues.image);
    restBody.image = null;
  }

  // Handle promotion/thumbnail image
  if (promotionImageName) {
    if (blog.thumb_image) deleteFile(uploadPath, blog.dataValues.thumb_image);
    promotionFileName = await uploadFile(
      uploadPath,
      thumb_image,
      promotionImageName
    ); // Await the promise here
  }
  if (promotionImageName === "" && blog.thumb_image) {
    deleteFile(uploadPath, blog.dataValues.thumb_image);
    restBody.thumb_image = null;
  }

  // Handle carousel image upload
  if (carousel_image && Array.isArray(carousel_image)) {
    // Upload new images (base64 format only)
    const updatedCarouselImages = await Promise.all(
      carousel_image.map(async (image, index) => {
        if (isBase64Image(image)) {
          const format = getImageFormat(image);
          const carouselImageName = `carouselImageName_${index}.${format}`;
          const uploadedImage = await uploadFile(
            "uploads/blogs/carousel",
            image,
            carouselImageName
          );
          return uploadedImage;
        }
        return image.split("/").pop();
      })
    );

    restBody.carousel_image = updatedCarouselImages;
  }

  // Update the blog with the new values
  await blog.update({
    ...restBody,
    blog_slug: blogSlug,
    ...(fileName && { image: fileName }), // Ensure this is a string
    ...(promotionFileName && { thumb_image: promotionFileName }), // Ensure this is a string
  });

  // Fetch updated blog with proper image URLs
  blog = await Blog.findOne({
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
            `CASE WHEN carousel_image IS NOT NULL THEN array_to_json(ARRAY(SELECT concat('${req.app.locals.baseurl}/${uploadCarousel}/', unnest(carousel_image)))) ELSE NULL END`
          ),
          "carousel_image",
        ],
      ],
    },
    where: { id },
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: blog,
  });
});

exports.toggleBlogStatus = asyncErrorHandler(async (req, res) => {
  const { id, status } = req.body;
  let blog = await Blog.findByPk(id);

  if (!blog) throw createHttpError(httpStatus.NOT_FOUND, "Blog doesn't exist");

  await blog.update({ status: status === 1 ? 0 : 1 });

  blog = await Blog.findOne({
    attributes: {
      include: [
        [
          literal(
            `CASE WHEN image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', image) ELSE NULL END`
          ),
          "image", // Alias to avoid conflict with the original column name
        ],
        [
          literal(
            `(SELECT json_agg(value) FROM "master_attribute_values"  WHERE id = ANY(category::integer[]))`
          ),
          "category", // Alias for category names
        ],
        [
          literal(
            `CASE WHEN blog_author_id IS NOT NULL THEN (SELECT value from "master_attribute_values" WHERE id = blog_author_id) ELSE NULL END`
          ),
          "author_name", // Alias to avoid conflict with the original column name
        ],
      ],
    },
    where: { id },
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: blog,
  });
});

exports.deleteBlog = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByPk(id);

  if (!blog) throw createHttpError(httpStatus.NOT_FOUND, "Blog doesn't exist");

  await blog.destroy();

  res.status(httpStatus.OK).json({
    success: true,
    data: blog,
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
          "image", // Alias to avoid conflict with the original column name
        ],
        [
          literal(
            `CASE WHEN thumb_image IS NOT NULL THEN concat('${req.app.locals.baseurl}/${uploadPath}/', thumb_image) ELSE NULL END`
          ),
          "thumb_image", // Alias to avoid conflict with the original column name
        ],
        // [
        //   literal(
        //     `CASE WHEN carousel_image IS NOT NULL
        //       THEN ARRAY(SELECT concat('${req.app.locals.baseurl}/${uploadCarousel}/', unnest(carousel_image)))
        //       ELSE ARRAY[]::text[]
        //     END`
        //   ),
        //   "carousel_image",
        // ],
      ],
    },
    where: { slug },
  });

  blog.setDataValue(
    "carousel_image_url",
    `${req.app.locals.baseurl}/${uploadCarousel}/`
  );

  if (!blog) throw createHttpError(httpStatus.NOT_FOUND, "Data not found!");

  res.status(httpStatus.OK).json({
    success: true,
    data: blog,
  });
});
