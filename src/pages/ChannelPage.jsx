import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const Container = styled.div`
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Button = styled.button`
  background: ${({ color }) => color || "#ff0000"};
  color: white;
  padding: 10px 16px;
  margin: 10px 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease-in-out;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 10px;
  }
`;

const VideoCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const LikeDislikeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
`;

const LikeButton = styled(ThumbUpIcon)`
  cursor: pointer;
  color: ${({ liked }) => (liked ? "blue" : "gray")};
`;

const DislikeButton = styled(ThumbDownIcon)`
  cursor: pointer;
  color: ${({ disliked }) => (disliked ? "red" : "gray")};
`;

const ChannelPage = () => {
  const [channel, setChannel] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { channelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/channels/${channelId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };

    fetchChannel();
  }, [channelId, currentUser, navigate]);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`/channels/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });

      setChannel((prevChannel) => ({
        ...prevChannel,
        videos: prevChannel.videos.filter((v) => v._id !== videoId),
      }));
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  const handleNameChange = async () => {
    try {
      await axios.put(`/channels/${channelId}`, { channelName: "New Channel Name" });

      // ✅ Fetch updated channel data
      const res = await axios.get(`/channels/${channelId}`);
      setChannel(res.data);
    } catch (error) {
      console.error("Error updating channel:", error);
    }
  };

  return (
    <Container>
      {channel ? (
        <>
          <Title>{channel.name}</Title>

          {currentUser?._id === channel.owner?.toString() && (
            <Button color="#3498db" onClick={handleNameChange}>Rename Channel</Button>
          )}

          <p>{channel.description}</p>

          {currentUser?._id === channel.owner && (
            <Button onClick={() => navigate("/upload")}>Upload Video</Button>
          )}

          <VideoGrid>
            {channel.videos.map((video) => (
              <VideoCard key={video._id}>
                <video src={video.videoUrl} controls className="w-full rounded-md" />
                <VideoTitle>{video.title}</VideoTitle>
                <p>{video.desc}</p>

                <LikeDislikeContainer>
                  <LikeButton liked={video.likes.includes(currentUser?._id)} />
                  {video.likes.length}
                  <DislikeButton disliked={video.dislikes.includes(currentUser?._id)} />
                  {video.dislikes.length}
                </LikeDislikeContainer>

                {currentUser?._id === channel.owner?.toString() && (
                  <div className="flex justify-between mt-2">
                    <Button color="#f39c12" onClick={() => navigate(`/edit/${video._id}`)}>Edit</Button>
                    <Button color="#e74c3c" onClick={() => handleDelete(video._id)}>Delete</Button>
                  </div>
                )}
              </VideoCard>
            ))}
          </VideoGrid>
        </>
      ) : (
        <p className="text-center mt-5">Loading...</p>
      )}
    </Container>
  );
};

export default ChannelPage;




