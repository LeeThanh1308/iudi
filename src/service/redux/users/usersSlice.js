import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: {},
    isLoading: "idle",
    isToggleChangeUser: false,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = "success";
      })
      .addCase(fetchProfile.pending, (state, action) => {
        state.isLoading = "pending";
      })
      .addCase(patchAvatar.fulfilled, (state, action) => {
        state.isToggleChangeUser = !state.isToggleChangeUser;
      })
      .addCase(patchProfile.fulfilled, (state, action) => {
        state.isToggleChangeUser = !state.isToggleChangeUser;
      });
  },
});

export const usersReducer = usersSlice.reducer;
export const usersSelector = (state) => state.users;

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfileStatus",
  async (userName) => {
    // const { user } = useSelector(usersSelector);
    // console.table({ user });
    const response = await axios.get(
      `https://api.iudi.xyz/api/profile/${userName}`
    );

    return response.data.Users[0];
  }
);

export const patchAvatar = createAsyncThunk(
  "auth/patchAvatarStatus",
  async ({ image, userID }) => {
    const data = {
      PhotoURL: image,
      SetAsAvatar: true,
    };

    try {
      const response = await axios.post(
        `https://api.iudi.xyz/api/profile/add_image/${userID}`,
        data
      );

      toast.success("Avatar updated successfully!");
    } catch (err) {
      toast.error(err);
    }
  }
);

export const patchProfile = createAsyncThunk(
  "auth/patchProfileStatus",
  async ({ data, userID }) => {
    try {
      const response = await axios.put(
        `https://api.iudi.xyz/api/profile/change_profile/${userID}`,
        data
      );

      toast.success("Updated profile!");
    } catch (error) {
      toast.error(error);
    }
  }
);
