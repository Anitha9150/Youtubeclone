import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { dislike, fetchFailure, fetchStart, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import { format } from "timeago.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap; /* Allow wrapping for small screens */
`;

const Content = styled.div`
  flex: 5;
  width: 100%; /* Full width on smaller screens */
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;

  @media (max-width: 768px) {
    max-height: 400px; /* Reduce height on medium screens */
  }

  @media (max-width: 480px) {
    max-height: 300px; /* Further reduce height on small screens */
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.bg};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const VideoInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin: 10px 0;
  width: 100%;
  flex-wrap: wrap; /* Wrap buttons on small screens */

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  padding: 8px 12px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 6px 10px;
  }
`;

const SubscribeButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 20px;
  margin-top: 10px;

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.textSoft};
  margin: 15px 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const CommentsContainer = styled.div`
  margin-top: 30px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 50px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.textSoft};
  border-radius: 5px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;

const CommentButton = styled.button`
  padding: 10px;
  border: none;
  background-color: ${({ theme }) => theme.light};
  color: black;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
`;

export { Container, Content, VideoFrame, Title, VideoInfo, Buttons, Button, SubscribeButton, Description, CommentsContainer, CommentInput, CommentButton };

// ✅ Video Component
const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const { videoId } = useParams();
 
const token = currentUser?.accessToken || localStorage.getItem("token") || "";

console.log("Redux Token:", currentUser?.accessToken);
console.log("LocalStorage Token:", localStorage.getItem("token"));
console.log("Final Token:", token);

  const [channel, setChannel] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch Video & Channel Data
  const fetchData = useCallback(async () => {
    if (!videoId) return;
    dispatch(fetchStart());

    try {
      const videoRes = await axios.get(`/videos/find/${videoId}`);
      dispatch(fetchSuccess(videoRes.data));

      if (videoRes.data?.userId) {
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
        setChannel(channelRes.data);
      }
    } catch (err) {
      console.error("Error fetching video or channel:", err.response?.data || err);
      dispatch(fetchFailure());
    }
  }, [videoId, dispatch]);
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${videoId}`);
      if (Array.isArray(res.data.comments)) {
        setChannel(res.data.user || {});

      } else {
        setComments([]); // Ensure it's always an array
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchComments();
  }, [videoId]); // ✅ Fetch comments when `videoId` changes
  

  // ✅ Handle Likes
  const handleLike = async () => {
    const token = currentUser?.accessToken || localStorage.getItem("token") || "";
    
    if (!token || token === "undefined") {
      console.error("No token found! Please log in again.");
      return;
    }
  
    try {
      const response = await axios.put(
        `/users/like/${currentVideo._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Like Response:", response.data); 
      dispatch(like(currentUser._id));
    } catch (error) {
      console.error("Error liking video:", error.response?.data || error);
    }
  };
  
  
  const handleDislike = async () => {
    const token = currentUser?.accessToken || localStorage.getItem("token") || "";
    
    if (!token || token === "undefined") {
      console.error("No token found! Please log in again.");
      return;
    }
  
    try {
      const response = await axios.put(
        `/users/dislike/${currentVideo._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Dislike Response:", response.data); 
      dispatch(dislike(currentUser._id));
    } catch (error) {
      console.error("Error disliking video:", error.response?.data || error);
    }
  };
  
  

  // ✅ Handle Subscribe/Unsubscribe
  const handleSub = async () => {
    if (!channel || !currentUser) return;
    await axios.put(
      `/users/${currentUser.subscribedUsers.includes(channel._id) ? "unsub" : "sub"}/${channel._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(subscription(channel._id));
  };

  // ✅ Handle Adding a Comment
  const handleCommentSubmit = async () => {
    const token = currentUser?.accessToken || localStorage.getItem("token") || "";
    
    if (!token || token === "undefined") {
      console.error("No token found! Please log in again.");
      return;
    }
  
    try {
      const res = await axios.post(
        `/comments/`,  
        { videoId, desc: newComment },  // ✅ Ensure key matches backend schema
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data.comment, ...comments]); // ✅ Update UI instantly
      setNewComment("");  // ✅ Clear input field
    } catch (error) {
      console.error("Error posting comment:", error.response?.data || error);
    }
  };
  
  
  return (
    <Container>
      <Content>
        {currentVideo?.videoUrl ? (
          <VideoFrame src={`http://localhost:4000${currentVideo.videoUrl}`} controls />
        ) : (
          <h3>Loading video...</h3>
        )}

        <Title>{currentVideo?.title || "Loading..."}</Title>

        <VideoInfo>
          <Link to={`/channel/${channel?._id || "#"}`} style={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}>
            {channel?.name || " Channel"}
          </Link>
          <span> • {currentVideo?.views || 0} views • {format(currentVideo?.createdAt)}</span>
        </VideoInfo>
        <Buttons>
  <Button onClick={handleLike}>
    <FontAwesomeIcon 
      icon={faThumbsUp} 
      style={{ 
        color: currentVideo?.likes?.includes(currentUser?._id) ? "blue" : "black",
        fontSize: "20px"
      }} 
    />
    <span>{currentVideo?.likes?.length || 0}</span>
  </Button>

  <Button onClick={handleDislike}>
    <FontAwesomeIcon 
      icon={faThumbsDown} 
      style={{ 
        color: currentVideo?.dislikes?.includes(currentUser?._id) ? "red" : "black",
        fontSize: "20px"
      }} 
    />
   

    <span>Dislike</span>
  </Button>
</Buttons>

        



        <SubscribeButton onClick={handleSub}>
          {currentUser?.subscribedUsers?.includes(channel?._id) ? "SUBSCRIBED" : "SUBSCRIBE"}
        </SubscribeButton>

        <Description>{currentVideo?.desc || "No description available."}</Description>

        {/* ✅ Comments Section */}
        <CommentsContainer>
          <h3>Comments</h3>
          <CommentInput value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
          <CommentButton onClick={handleCommentSubmit}>Comment</CommentButton>

          {comments.map((comment) => (
            <div key={comment._id}>
              <p>
        <strong>{comment.userId?.name || "Unknown"}</strong>: {comment.text}</p>
            </div>
          ))}
        </CommentsContainer>
      </Content>
    </Container>
  );
};

export default Video;







