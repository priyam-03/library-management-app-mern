import React, { useState } from "react";
import axios from "axios";
import "./../screens/DashboardScreen.css";
import BookCard from "../components/Bookcard";
const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const { data } = await axios.post(`/api/v1/search/?keyword=${query}`);
    setSuggestions(data.books);
  };
  return (
    <>
      <div>
        <input type="text" value={searchQuery} onChange={handleSearchChange} />
      </div>
      <div className="books">
        {suggestions &&
          suggestions.map((book) => <BookCard book={book}></BookCard>)}
      </div>
    </>
  );
};

export default SearchComponent;
