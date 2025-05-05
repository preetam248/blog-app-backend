const mongoose = require("mongoose");
const { DB_NAME } = require("../const/index");

const connectDb = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${process.env.DB_URL}/${DB_NAME}`
    );
    console.log(`Database connected. Host: ${connectInstance.connection.host}`);
  } catch (error) {
    console.log("Database connection error");
  }
};

module.exports = connectDb;