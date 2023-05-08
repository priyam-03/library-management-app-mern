const Book = require("../models/bookModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.newBook = catchAsyncErrors(async (req, res, next) => {
  const { bookid, name, author, publisher } = req.body;
  console.log(req.file);
  const { originalname, path, mimetype } = req.file;

  const book = await Book.create({
    bookid,
    name,
    author,
    publisher,
    bookimage: {
      fileName: originalname,
      filePath: path,
      fileType: mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    },
    availability: true,
  });
  res.status(200).json({
    success: true,
    book,
  });
});
exports.checkBook = catchAsyncErrors(async (req, res, next) => {
  const { book_id } = req.body;
  const book = Book.findOne({ bookid: book_id });
  const newbook = await Book.create({
    bookid: book.bookid,
    name: book.name,
    author: book.author,
    publisher: book.publisher,
    bookimage: {
      fileName: book.bookimage.fileName,
      filePath: book.bookimage.filePath,
      fileType: book.bookimage.fileType,
      fileSize: book.bookimage.fileSize,
    },
    availability: true,
  });
  res.status(200).json({
    success: true,
    book,
  });
});
exports.getAllBook = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    success: true,
    books,
  });
});

exports.getBookDetails = async (req, res, next) => {
  const book = await Book.findById(req.params.bookid);

  res.status(200).json({
    success: true,
    book,
  });
};

exports.searchBook = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword;
  // const regexPattern = new RegExp(keyword, "i");
  // const books = await Book.find({
  //   $or: [
  //     { name: { $regex: regexPattern } },
  //     { author: { $regex: regexPattern } },
  //     { publisher: { $regex: regexPattern } },
  //   ],
  // });
  const books = await Book.find({
    $text: {
      $search: keyword,
      $caseSensitive: false,
      $diacriticSensitive: false,
      // $all: true,
    },
  });
  res.status(200).json({
    success: true,
    books,
  });
});
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};
