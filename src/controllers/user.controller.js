const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const {
  uploadOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const localAvatarPath = req.file?.path;
  if (!name || !email || !password || !localAvatarPath) {
    return res
      .status(400)
      .json({ message: "Require fields are missing", success: false });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
  }
  let avatar;
  try {
    avatar = await uploadOnCloudinary(localAvatarPath);
    console.log("Upload Avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
  }

  try {
  
    const user = await User.create({
      name,
      email,
      password,
      image: avatar.url || "",
    });
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return res.status(500).json({
        message: "Somethings went wrong while registering the user",
        success: false,
      });
    }

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: createdUser,
    });
  } catch (error) {
    console.log("User creation failed");
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
      const loggedUser = await User.findById(user._id).select("-password");
    res
      .status(200)
      .json({ message: "Login successful", success: true, token, user:loggedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  signup,
  login,
};
