const express = require("express");
const { upload } = require("../utils/filehelper");
const {
  newBook,
  getAllBook,
  getBookDetails,
} = require("../controllers/bookController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/newBook").post(upload.single("bookimage"), newBook);
router.route("/getAllBook").get(getAllBook);
router.route("/getBookDetails/:bookid").get(getBookDetails);

module.exports = router;
