import React, { Fragment, useEffect, useState } from "react";
import BookCard from "../components/Bookcard";
import { getAllBook } from "../services/api";
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
      <h2>All Books</h2>
      <div className="books">
        {allBook && allBook.map((book) => <BookCard book={book}></BookCard>)}
      </div>
    </Fragment>
  );
};
export default DashboardScreen;
