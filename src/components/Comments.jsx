import axios from "../axios";
import React, { useEffect, useState, memo } from "react";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
`;

const CommentContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.bgLighter};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
`;

const Text = styled.span`
  font-size: 15px;
  line-height: 1.4;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

// 📝 Optimized Comment Component (prevents unnecessary re-renders)
const Comment = memo(({ comment }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    if (!comment.userId) return;

    axios
      .get(`/users/find/${comment.userId}`)
      .then((res) => setChannel(res.data.user))
      .catch((err) => console.error("Error fetching user:", err));
  }, [comment.userId]);

  return (
    <CommentContainer>
      <Avatar src={channel?.img || "/default-avatar.png"} alt="User Avatar" />
      <Details>
        <Name>
          {channel?.name || "Unknown User"} <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </CommentContainer>
  );
});

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!videoId) return; // Prevent unnecessary fetches

    axios
      .get(`/comments/${videoId}`)
      .then((res) => setComments(res.data.comments || []))
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setComments([]); // Prevent errors from breaking UI
      });
  }, [videoId]);

  return (
    <Container>
      {comments.length > 0 ? (
        comments.map((comment) => <Comment key={comment._id} comment={comment} />)
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </Container>
  );
};

export default Comments;






