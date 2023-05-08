const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookid: {
    type: String,
    required: [true, "Please Enter Bookid"],
  },
  name: {
    type: String,
    text: true,
    required: [true, "Please Enter Book name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  author: {
    type: String,
    text: true,
    required: [true, "Please Enter author name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  publisher: {
    type: String,
    text: true,
    required: [true, "Please Enter publisher name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  bookimage: {
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
  },
  availability: {
    type: Boolean,
    default: true,
  },
});
bookSchema.index(
  { author: "text", name: "text", publisher: "text" }

  // {
  //   default_language: "none",
  //   collation: { locale: "en", strength: 2 },
  // }
);
module.exports = mongoose.model("Book", bookSchema);
