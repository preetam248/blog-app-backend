const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(402).json({ message: "unauthorized" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(402).json({ message: "invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in authentication", error);
  }
};


module.exports = isAuthenticated;