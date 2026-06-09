import { createSlice } from "@reduxjs/toolkit";

const savedLike = localStorage.getItem("like");
const initialState = {
  value: savedLike ? JSON.parse(savedLike) : [],
};
export const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    addLike: (state, action) => {
      state.value.push(action.payload);
      localStorage.setItem("like", JSON.stringify(state.value));
    },
    deleteLike: (state, action) => {
      state.value = state.value.filter((item) => item.id !== action.payload);
      localStorage.setItem("like", JSON.stringify(state.value));
    },
    setLikes: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("like", JSON.stringify(state.value));
    },
  },
});

export const { addLike, deleteLike, setLikes } = likeSlice.actions;
export default likeSlice.reducer;
