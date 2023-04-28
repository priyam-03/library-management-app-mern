import React, { Fragment, useEffect, useState } from "react";
import { getBookDetails, rentBook } from "../services/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import axios from "axios";
const usersUrl = "http://localhost:4000";

const BookDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Book, setBook] = useState({});
  const [filepath, setFilepath] = useState("");
  const [availability, setAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  console.log(id);

  const getBook = async () => {
    try {
      setLoading(true);

      const result = await axios.get(`${usersUrl}/api/v1/getBookDetails/${id}`);

      const fetchedbook = await result.data.book;
      setBook(fetchedbook);
      setFilepath(fetchedbook.bookimage.filePath);
      setAvailability(fetchedbook.availability);

      setLoading(false);
      // setBook(...Book, result.data.book);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBook();
  }, []);

  const rentnewBook = async () => {
    try {
      const result = await rentBook(userInfo.user._id, id);
      dispatch(setCredentials(result.data.user));
      navigate("/user-profile");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(Book);
  return (
    <div>
      {loading && <div>Loading</div>}
      {!loading && (
        <div>
          <p>{Book.name}</p>
          <p>{Book.author}</p>
          <p>{Book.publisher}</p>
          <img src={`http://localhost:4000/${filepath}`} alt="image" />
          {availability && <button onClick={rentnewBook}>Rent It</button>}
          {!availability && <p>Sorry it is not available right now</p>}
        </div>
      )}
    </div>
  );
};
export default BookDetails;
