import React from "react";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  align-items: flex-start;
  flex-wrap: wrap; // Prevents overflow on smaller screens

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 85%; // Prevents overflow on small screens
  color: ${({ theme }) => theme.text};

  @media (max-width: 600px) {
    max-width: 80%;
  }
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

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Comment = ({ comment }) => {
  const { userId, desc, createdAt } = comment;
  return (
    <Container>
      <Avatar src={userId?.img || "/avatar.png"} alt="User Avatar" />
      <Details>
        <Name>
          {userId?.name || "Unknown User"} <Date>{format(createdAt)}</Date>
        </Name>
        <Text>{desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;







