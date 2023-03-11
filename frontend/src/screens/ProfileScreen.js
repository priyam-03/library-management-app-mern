import { useSelector } from "react-redux";
import "../styles/profile.css";

import { useState, useEffect } from "react";
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
  const [Book, setBook] = useState({});
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
      <figure>{userInfo.user?.name.charAt(0).toUpperCase()}</figure>
      <img
        className="profile-image"
        src={`http://localhost:4000/${userInfo.user.avatar.filePath}`}
        alt="img"
      />
      <span>
        Welcome <strong>{userInfo.user?.name}!</strong>
      </span>
      <div>
        <TableHead>
          <TableCell>Id</TableCell>
          <TableCell>No of book taken</TableCell>
        </TableHead>
        <TableBody>
          {userInfo.user.rentBook.map((user) => (
            <div>
              <TableCell>{user.book_id}</TableCell>
              <TableCell>{user.no_of_day}</TableCell>
            </div>
          ))}
          <TableCell>
            <Button
              color="primary"
              variant="contained"
              style={{ marginRight: 10 }}
            >
              Submit Book
            </Button>
          </TableCell>
        </TableBody>
      </div>
    </div>
  );
};

export default ProfileScreen;
