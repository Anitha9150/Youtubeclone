import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useChannelId from "../useChannelId";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Slight overlay effect */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Wrapper = styled.div`
  width: 90%;
  max-width: 500px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 95%;
    padding: 15px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  text-align: center;
  font-size: 20px;

  @media (max-width: 500px) {
    font-size: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 5px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};

  @media (max-width: 500px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const Desc = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 5px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: 100px;

  @media (max-width: 500px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textSoft};
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 500px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

const Upload = ({ setOpen, videoId }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [existingVideo, setExistingVideo] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const channelId = useChannelId();

  useEffect(() => {
    if (videoId) {
      const fetchVideo = async () => {
        try {
          const res = await axios.get(`/videos/${videoId}`);
          setExistingVideo(res.data);
          setInputs({ title: res.data.title, desc: res.data.desc });
          setTags(res.data.tags.join(","));
        } catch (error) {
          console.error("Error fetching video:", error);
        }
      };
      fetchVideo();
    }
  }, [videoId]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      alert("Please upload a video!");
      return;
    }
    if (!channelId) {
      alert("Your channel ID is missing. Please create a channel first.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", video);
      if (img) formData.append("img", img);

      let uploadRes;
      if (existingVideo) {
        uploadRes = await axios.put(`/videos/edit/${videoId}`, formData, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });
      } else {
        uploadRes = await axios.post("/upload/video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { video: uploadedVideo } = uploadRes.data;
      const videoUrl = uploadedVideo.videoUrl;
      const imgUrl = uploadedVideo.imgUrl;

      const res = await axios.post(
        "/videos",
        {
          ...inputs,
          imgUrl,
          videoUrl,
          tags,
          channelId,
          userId: currentUser._id,
        },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );

      setOpen(false);
      navigate(`/video/${res.data.video._id}`);
    } catch (error) {
      console.error("Upload failed:", error.response ? error.response.data : error.message);
      alert("Failed to upload the video. Please try again!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>{existingVideo ? "Edit Video" : "Upload a New Video"}</Title>

        <Label>Video:</Label>
        <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />

        <Input type="text" placeholder="Title" name="title" value={inputs.title || ""} onChange={handleChange} />

        <Desc placeholder="Description" name="desc" rows={5} value={inputs.desc || ""} onChange={handleChange} />

        <Input type="text" placeholder="Tags (comma-separated)" value={tags || ""} onChange={handleTags} />

        <Label>Thumbnail:</Label>
        <Input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />

        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : existingVideo ? "Update Video" : "Upload"}
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
