import React, { Fragment, useEffect, useState } from "react";
import { getBookDetails, rentBook } from "../services/api";
import { useParams } from "react-router-dom";
const BookDetails = () => {
  const [Book, setBook] = useState({});
  console.log(Book);
  const { id } = useParams();
  console.log(id);
  //   useEffect(() => {
  //     console.log("gi");
  //     getBook();
  //   }, []);

  useEffect(() => {
    console.log("HI");
    const getBook = async (id) => {
      alert("hi");
      try {
        const book = await getBookDetails(id);

        setBook(book.data.book);
        console.log(book.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, []);
  console.log("jhi");

  const rentnewBook = async () => {
    try {
      const data = rentBook(id);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <img
        src={`http://localhost:4000/${Book.bookimage.filePath}`}
        alt="image"
      />
      <p>{Book.name}</p>
      <p>{Book.author}</p>
      <p>{Book.publisher}</p>
      {Book.available && <button onClick={rentnewBook}>Rent It</button>}
      {!Book.available && <p>Sorry it is not available right now</p>}
    </div>
  );
};
export default BookDetails;
