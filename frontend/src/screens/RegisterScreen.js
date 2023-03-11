import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import { registerUser } from "../features/auth/authActions";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
const schema = yup.object().shape({
  files: yup.mixed().test("required", "Please select a file", (value) => {
    return value && value.length;
  }),
});
const RegisterScreen = () => {
  const [customError, setCustomError] = useState(null);
  const [singleFile, setSingleFile] = useState("");
  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );
  const SingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // redirect authenticated user to profile screen
    if (userInfo) navigate("/user-profile");
    // redirect user to login page if registration was successful
    // if (success) navigate("/user-profile");
  }, [navigate, userInfo, success]);

  const submitForm = (data) => {
    // check if passwords match

    if (data.password !== data.confirmPassword) {
      setCustomError("Password mismatch");
      return;
    }
    // transform email string to lowercase to avoid case sensitivity issues in login
    data.email = data.email.toLowerCase();
    console.log(data);
    var formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("file", singleFile);

    const formDataObj = {};
    formData.forEach((value, key) => (formDataObj[key] = value));
    console.log(formDataObj.file);
    dispatch(registerUser(formDataObj));
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <Error>{error}</Error>}
      {customError && <Error>{customError}</Error>}
      <div className="form-group">
        <label htmlFor="name">First Name</label>
        <input
          type="text"
          className="form-input"
          {...register("name")}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-input"
          {...register("email")}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-input"
          {...register("password")}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Confirm Password</label>
        <input
          type="password"
          className="form-input"
          {...register("confirmPassword")}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="fileupload">Profile Photo</label>
        <input
          id="fileupload"
          type="file"
          className="form-input"
          onChange={(e) => SingleFileChange(e)}
          required
        />
      </div>
      <button type="submit" className="button" disabled={loading}>
        {loading ? <Spinner /> : "Register"}
      </button>
      {errors.files && <div className="error">{errors.files.message}</div>}
    </form>
  );
};

export default RegisterScreen;
