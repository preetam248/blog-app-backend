const app = require("./app");
require("dotenv").config();
const connectDb = require("./config/db");
const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port number: ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Server not up due to database connection error");
  });
