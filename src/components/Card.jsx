import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import Loading from "./Loading";

const Container = styled.div`
  width: ${(props) => (props.type !== "sm" ? "360px" : "100%")};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: flex;
  flex-direction: ${(props) => (props.type === "sm" ? "row" : "column")};
  gap: 12px;
  background-color: white;
  color: black;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const MediaWrapper = styled.div`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #ddd;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 600px) {
    height: ${(props) => (props.type === "sm" ? "100px" : "180px")};
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type !== "sm" ? "16px" : "0")};
  gap: 12px;
  flex: 1;
  align-items: center;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ChannelImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #bbb;
  display: ${(props) => (props.type === "sm" ? "none" : "block")};

  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
  }
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: black;
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: black;
  margin: 5px 0;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const Info = styled.div`
  font-size: 14px;
  color: black;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const Card = ({ video, type }) => {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!video?.userId) return;

    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.error("❌ Error fetching channel:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [video?.userId]);

  const imageUrl = video.imgUrl ? `http://localhost:4000${video.imgUrl}` : "/default-thumbnail.png";
  const channelImgUrl = channel?.img ? `http://localhost:4000${channel.img}` : "/avatar.png";

  if (loading) return <Loading />;
  if (error) return <p>Error loading channel data.</p>;

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <MediaWrapper type={type}>
          <Image src={imageUrl} alt="Video Thumbnail" loading="lazy" />
        </MediaWrapper>
        <Details type={type}>
          <ChannelImage type={type} src={channelImgUrl} alt="Channel Avatar" />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel?.username || "Channel"}</ChannelName>
            <Info>{video.views} views • {format(video.createdAt)}</Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;


