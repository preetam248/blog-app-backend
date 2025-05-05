const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      require: true,
    },
    image: {
      type: Schema.Types.String,
    },
    category: {
      type: Schema.Types.String,
      require: true,
    },
    description: {
      type: Schema.Types.String,
      require: true,
    },
    author: {
      id: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      name: {
        type: Schema.Types.String,
        required: true,
      },
      image: {
        type: Schema.Types.String,
      },
    },
  },
  { timestamps: true }
);

const Blog = model("blogs", blogSchema);

module.exports = Blog;