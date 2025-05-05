const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

const userRouter = require("./routes/user.route");
const blogRouter = require("../src/routes/blog.route")
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.status(200).send("Hello from server");
});

module.exports = app;
