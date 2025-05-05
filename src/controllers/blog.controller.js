const asyncHandler = require("../utils/asyncHandler");
const Blog = require("../models/blog.model");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const allBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "All blogs", blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, category, description } = req.body;
    const coverLocalPath = req.file?.path;
    let cover;
    try {
      cover = await uploadOnCloudinary(coverLocalPath);
      console.log("Cover upload successfully", cover.url);
    } catch (error) {
      console.log("Error uploading cover", error);
    }

    try {
      const blog = await Blog.create({
        title,
        category,
        description,
        image: cover.url,
        author: {
          id: req.user._id,
          name: req.user.name,
          image: req.user.image,
        },
      });
      return res
        .status(201)
        .json({ message: "blog created", success: true, blog });
    } catch (error) {
      console.log("Fail to create blog", error);
      cover && (await deleteFromCloudinary(cover.public_id));
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "blog not found", success: false });
  }
  if (blog.author.id.toString() !== req.user.id.toString()) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this blog", success: false });
  }
  await blog.deleteOne();
  return res
    .status(201)
    .json({ message: "blog deleted successfully", success: true });
});

const singleBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    return res
      .status(200)
      .json({ message: "blog  found", success: true, blog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
});

const userBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({ "author.id": req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({blogs});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "internal server error", success: false });
  }
});

module.exports = {
  allBlogs,
  createBlog,
  deleteBlog,
  singleBlog,
  userBlogs,
};
