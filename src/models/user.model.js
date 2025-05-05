const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function(next){
  if (!this.isModified("password")) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 10);
})

const User = model("users", userSchema);

module.exports = User;