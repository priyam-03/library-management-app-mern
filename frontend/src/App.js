import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import ProtectedRoute from "./routing/ProtectedRoute";
import BookDetails from "./screens/Bookdetails";
import DashboardScreen from "./screens/DashboardScreen";
import PaymentSuccess from "./screens/PaymentSuccess";
import Paymentscreen from "./screens/Paymentscreen";
import SearchComponent from "./components/SearchComponent";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <main className="container content">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/user-profile" element={<ProfileScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route path="/payment" element={<Paymentscreen />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/search" element={<SearchComponent />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
