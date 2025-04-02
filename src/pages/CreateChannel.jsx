import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const CreateChannel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!currentUser) {
    navigate("/signin");
    return null;
  }

  const handleCreateChannel = async () => {
    try {
      await axios.post(
        "/channel",
        { name, description },
        { headers: { Authorization: `Bearer ${currentUser.accessToken}` } }
      );
      navigate("/");
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4"
      style={{ paddingTop: "80px" }}>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Channel</h1>

        <input
          type="text"
          placeholder="Channel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-3 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleCreateChannel}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition duration-200"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateChannel;




