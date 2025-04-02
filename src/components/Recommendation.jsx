import axios from "../axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Responsive grid */
  gap: 15px;
  padding: 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); /* Adjusts for tablets */
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* Adjusts for smaller screens */
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* Stacks cards on small screens */
    gap: 10px;
  }
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/tags?tags=${tags}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      }
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;



