import React, { Fragment, useEffect, useState } from "react";
import BookCard from "../components/Bookcard";
import { getAllBook } from "../services/api";
import "./DashboardScreen.css";
const DashboardScreen = () => {
  const [allBook, setAllBook] = useState([]);
  useEffect(() => {
    getAllBookList();
  }, []);
  const getAllBookList = async () => {
    try {
      const Booklist = await getAllBook();
      console.log(Booklist.data);
      setAllBook(Booklist.data.books);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <div className="outerDiv">
        <h1>All Books</h1>

        <div className="books">
          {allBook && allBook.map((book) => <BookCard book={book}></BookCard>)}
        </div>
      </div>
    </Fragment>
  );
};
export default DashboardScreen;
