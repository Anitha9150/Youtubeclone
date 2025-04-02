import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideo: null,
  loading: false,
  error: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
      state.error = false;
    },
    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    like: (state, action) => {
      if (!state.currentVideo) return; // ✅ Prevent crash if currentVideo is null
      if (!state.currentVideo.likes.includes(action.payload)) {
        state.currentVideo.likes.push(action.payload);
        const index = state.currentVideo.dislikes.findIndex(
          (userId) => userId === action.payload
        );
        if (index !== -1) {
          state.currentVideo.dislikes.splice(index, 1); // ✅ Remove only if found
        }
      }
    },
    dislike: (state, action) => {
      if (!state.currentVideo) return; // ✅ Prevent crash if currentVideo is null
      if (!state.currentVideo.dislikes.includes(action.payload)) {
        state.currentVideo.dislikes.push(action.payload);
        const index = state.currentVideo.likes.findIndex(
          (userId) => userId === action.payload
        );
        if (index !== -1) {
          state.currentVideo.likes.splice(index, 1); // ✅ Remove only if found
        }
      }
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, dislike } =
  videoSlice.actions;

export default videoSlice.reducer;




