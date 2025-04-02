import axios from "../axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
  padding: 10px;
`;

const SearchBar = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  padding: 10px;

  input {
    width: 100%;
    max-width: 400px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    padding: 8px 15px;
    background-color: #0073ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    input {
      width: 100%;
    }
  }
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      if (searchQuery.trim()) {
        try {
          console.log(`Fetching videos with query: ${searchQuery}`);
          const res = await axios.get(`/videos/search?q=${searchQuery}`);
          console.log("API Response:", res.data);
          setVideos(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
          console.error("Error fetching videos:", error);
          setVideos([]);
        }
      }
    };

    fetchVideos();
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos"
        />
        <button type="submit">Search</button>
      </SearchBar>

      <Container>
        {videos.length > 0 ? (
          videos.map((video) => <Card key={video._id} video={video} />)
        ) : (
          <p>No videos found.</p>
        )}
      </Container>
    </div>
  );
};

export default Search;



