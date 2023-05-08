import { useSelector } from "react-redux";
import "../styles/profile.css";
import { submitBook } from "../services/api";
import { useState, useEffect } from "react";
import { profile } from "../features/auth/authActions";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import axios from "axios";
import {
  Table,
  TableHead,
  TableCell,
  Paper,
  TableRow,
  TableBody,
  Button,
  styled,
  StyledTable,
  THead,
} from "@mui/material";
const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Book, setBook] = useState({});
  const { userInfo } = useSelector((state) => state.auth);
  const submitTakenBook = (id) => async () => {
    console.log(id);
    try {
      const result = await submitBook(id);
      dispatch(setCredentials(result.data.user));
      navigate("/user-profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(profile());
  }, []);
  return (
    <div>
      <figure>
        <img
          className="profile-image"
          src={`http://localhost:4000/${userInfo.user.avatar.filePath}`}
          alt="img"
        />
      </figure>

      <span>
        Welcome <strong>{userInfo.user?.name}!</strong>
      </span>
      <div>Fine:{userInfo.user.fine}</div>
      <Link to={`/payment`}>Pay</Link>
      <Link to="/updatePassword">Update Password</Link>
      <Link to="/updateProfile">Update Profile</Link>
      <div>
        <TableHead>
          <TableCell>Book name</TableCell>
          <TableCell>No of days book taken</TableCell>
        </TableHead>
        {userInfo.user.rentBook.length > 0 && (
          <TableBody>
            {userInfo.user.rentBook.map((user) => (
              <div>
                <TableCell>{user.book_name}</TableCell>
                <TableCell>{user.no_of_day}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="contained"
                    style={{ marginRight: 10 }}
                    onClick={submitTakenBook(user.book_id)}
                  >
                    Submit Book
                  </Button>
                </TableCell>
              </div>
            ))}
            <TableCell></TableCell>
          </TableBody>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
