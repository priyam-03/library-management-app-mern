import React from "react";
import { Link } from "react-router-dom";
import { getBookDetails, rentBook } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import "./Bookcard.css";
const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const rentnewBook = async () => {
    try {
      const result = await rentBook(userInfo.user._id, book._id);
      console.log(result.data.user);
      dispatch(setCredentials(result.data.user));
      navigate("/user-profile");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Link to={`/book/${book._id}`} className="bookcard">
      <img
        src={`http://localhost:4000/${book.bookimage.filePath}`}
        alt="image"
        className="bookImage"
      />
      <h3>{book.name}</h3>
      <h3>{book.author}</h3>
      {/* {book.availability && <button onClick={rentnewBook}>Rent It</button>}
      {!book.availability && <p>Sorry it is not available right now</p>} */}
    </Link>
  );
};
export default BookCard;
