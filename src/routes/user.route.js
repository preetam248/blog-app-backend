const Router = require("express");
const upload = require("../middlewares/multer.middleware");
const { signup, login } = require("../controllers/user.controller");

const router = Router();

router.post("/signup", upload.single("image"), signup);
router.post("/login", login);

module.exports = router;

