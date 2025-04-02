import { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "../axios";
import { useSearchParams } from "react-router-dom";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 10px;
  }
`;

const Message = styled.h2`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.textSoft};
  font-size: 18px;
  padding: 10px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`/videos/filter?filter=${filter}`);
        console.log("Fetched API response:", res.data);
    
        const videosWithChannel = await Promise.all(
          res.data.videos.map(async (video) => {
            try {
              const channelRes = await axios.get(`/users/find/${video.userId}`);
              return { 
                ...video, 
                channelName: channelRes.data.name || "Unknown Channel",
                channelImgUrl: channelRes.data.img || "/avatar.png"
              };
            } catch (err) {
              return { 
                ...video, 
                channelName: "Unknown Channel",
                channelImgUrl: "/avatar.png"
              };
            }
          })
        );
    
        setVideos(videosWithChannel);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [filter]);
  
  return (
    <Container>
      {loading ? (
        <Message>Loading videos...</Message>
      ) : error ? (
        <Message>Failed to load videos. Please try again.</Message>
      ) : videos.length === 0 ? (
        <Message>No videos found.</Message>
      ) : (
        videos.map((video) => <Card video={video} key={video._id} />)
      )}
    </Container>
  );
};

export default Home;