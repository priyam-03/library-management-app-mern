import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
// import { useGetDetailsQuery } from "../app/services/auth/authService";
import { logout } from "../features/auth/authActions";
import { setCredentials } from "../features/auth/authSlice";

// import { profile } from "../features/auth/authActions";
import "../styles/header.css";

const Header = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  const dispatch = useDispatch();
  // console.log(userInfo);
  // dispatch(profile());
  // automatically authenticate user if token is found
  // const { data, isFetching } = useGetDetailsQuery("userDetails", {
  //   pollingInterval: 900000, // 15mins
  // });

  // useEffect(() => {
  //   if (data) dispatch(setCredentials(data));
  // }, [data, dispatch]);

  return (
    <header>
      <div className="header-status">
        {/* <span>
          {isFetching
            ? `Fetching your profile...`
            : userInfo !== null
            ? `Logged in as ${userInfo.email}`
            : "You're not logged in"} */}
        {/* {userInfo && `Logged in as ${userInfo.email}`}
          {userInfo === null && "You're not logged in"} */}
        {/* </span> */}
        <div className="cta">
          {isAuthenticated ? (
            <div>
              <button className="button" onClick={() => dispatch(logout())}>
                Logout
              </button>
              <img
                className="profile-image"
                src={`http://localhost:4000/${userInfo.user.avatar.filePath}`}
                alt="img"
              />
            </div>
          ) : (
            <NavLink className="button" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
      <nav className="container navigation">
        {isAuthenticated ? (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/user-profile">Profile</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/search">Search book</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
