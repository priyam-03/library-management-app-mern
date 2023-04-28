const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req);
  const { originalname, path, mimetype } = req.file;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      fileName: originalname,
      filePath: path,
      fileType: mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    },
  });

  sendToken(user, 201, res);
});
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  var avatar = null;
  if (req.file === undefined) {
    avatar = req.user.avatar;
  } else {
    avatar = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    avatar,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
exports.test = catchAsyncErrors(async (req, res, next) => {
  const data = req.user._id;
  console.log(req.cookies);
  res.status(200).json({
    success: true,
    message: data,
  });
});
// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://localhost:3000/resetpassword/${resetToken}`;
  console.log(resetPasswordUrl);
  const text = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  console.log(user.email);
  try {
    await sendEmail({
      mail: user.email,
      subject: `Password Recovery`,
      text: text,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  console.log(req.params.token);
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHander("Password does not match confirmpassword", 400)
    );
  }

  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const now = new Date();
  console.log(user.rentBook.length);
  if (user.rentBook.length > 0) {
    for (var i = 0; i < user.rentBook.length; i++) {
      const timeSinceLastUpdate =
        (now.getTime() - new Date(user.rentBook[i].createdAt).getTime()) /
        (1000 * 24 * 60 * 60);
      user.rentBook[i].no_of_day = Math.round(timeSinceLastUpdate);
      user.fine += user.rentBook[i].no_of_day * 2;
    }
    // Update the createdAt field to reflect the current date
  }

  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

exports.rentNewBook = catchAsyncErrors(async (req, res, next) => {
  const { userid } = req.body;
  const user = await User.findById(userid);
  console.log("user" + user);
  const bookid = req.params.bookid;
  console.log(bookid);
  const book = await Book.findById(bookid);
  console.log(book);
  book.availability = false;
  const this_time = Date.now();
  const newRentBook = {
    book_id: bookid,
    no_of_day: Date.now() - this_time,
  };
  user.rentBook.push(newRentBook);
  await user.save();
  await book.save();
  res.status(200).json({
    success: true,
    book,
    user,
  });
});
exports.submitTakenBook = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const { id } = req.body;

  const book = await Book.findById(id);
  console.log(book);
  console.log(user);
  book.availability = true;
  var i = user.rentBook.length;
  while (i--) {
    console.log(mongoose.Types.ObjectId(id));
    console.log(user.rentBook[i]["book_id"]);
    if (user.rentBook[i]["book_id"].equals(mongoose.Types.ObjectId(id))) {
      console.log(user.rentBook[i]["book_id"]);
      user.rentBook.splice(i, 1);
    }
  }

  await user.save();
  await book.save();
  res.status(200).json({
    success: true,
    book,
    user,
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
