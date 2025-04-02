import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "./axios";

const useChannelId = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [channelId, setChannelId] = useState(null);

  useEffect(() => {
    const fetchChannelId = async () => {
      if (currentUser) {
        try {
          const res = await axios.get(`/users/${currentUser._id}`);
          setChannelId(res.data.channelId); // Ensure your API returns `channelId`
        } catch (error) {
          console.error("Error fetching channel ID:", error);
        }
      }
    };
    fetchChannelId();
  }, [currentUser]);

  return channelId;
};

export default useChannelId;
