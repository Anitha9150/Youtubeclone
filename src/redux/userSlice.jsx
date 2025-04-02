import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;

      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.accessToken);
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
      
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    subscription: (state, action) => {
      if (state.currentUser?.subscribedUsers.includes(action.payload)) {
        state.currentUser.subscribedUsers = state.currentUser.subscribedUsers.filter(
          (channelId) => channelId !== action.payload
        );
      } else {
        state.currentUser?.subscribedUsers.push(action.payload);
      }
      localStorage.setItem("user", JSON.stringify(state.currentUser));
    },
  },
});

// ✅ Ensure `subscription` is exported
export const { loginStart, loginSuccess, loginFailure, logout, subscription } = userSlice.actions;

export default userSlice.reducer;





