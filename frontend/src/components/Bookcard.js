import React from "react";
import { Link } from "react-router-dom";
const BookCard = ({ book }) => {
  return (
    <Link className="bookcard" to={`/book/${book._id}`}>
      <img
        src={`http://localhost:4000/${book.bookimage.filePath}`}
        alt="image"
      />
      <h3>{book.name}</h3>
      <h3>{book.author}</h3>
    </Link>
  );
};
export default BookCard;
