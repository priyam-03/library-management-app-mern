import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
const Paymentscreen = () => {
    const [amount, setAmount] = useState(0);
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const changeAmount=(e)=>{
    setAmount(e.target.value);
  }
    const checkoutHandler = async (amount) => {
        const {
          data: { key },
        } = await axios.get("/api/getkey");
    
        const {
          data: { order },
        } = await axios.post(
          "/api/checkout",
          {
            amount,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
          { withCredentials: true }
        );
    
        const options = {
          key,
          amount: order.amount,
          currency: "INR",
          name: "sudhu taka chai",
          description: "taka de",
          image: "/logo512.png",
          order_id: order.id,
          callback_url: "http://localhost:4000/api/paymentverification",
          prefill: {
            name: userInfo.user?.name,
            email: userInfo.user.email,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#121212",
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      };
  return (
    <div>
      <p>Enter the amount you want to pay</p>
      <input type="number"
      onChange={(e) => changeAmount(e)}
      required
      />
      <button onClick={() => {
          checkoutHandler(amount);
        }}>Pay</button>
    </div>
  )
}

export default Paymentscreen
