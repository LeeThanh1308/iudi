import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import config from "../../../configs/Configs.json";
import { toast } from "react-toastify";

const { API__SERVER } = config;

const initialState = {
  posts: [],
  post: [],
  loading: "idle",
  changeTogglePosts: false,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action?.payload;
        state.loading = "successed";
      })
      .addCase(fetchDetailPost.fulfilled, (state, action) => {
        state.post = [action?.payload];
        state.loading = "successed";
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(addLikePost.fulfilled, (state, action) => {
        state.changeTogglePosts = !state?.changeTogglePosts;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        if (action.payload) state.changeTogglePosts = !state?.changeTogglePosts;
      })
      .addCase(patchPost.fulfilled, (state, action) => {
        state.changeTogglePosts = !state?.changeTogglePosts;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.changeTogglePosts = !state?.changeTogglePosts;
      })
      .addCase(likeUnlikeComment.fulfilled, (state, action) => {
        state.changeTogglePosts = !state?.changeTogglePosts;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.changeTogglePosts = !state?.changeTogglePosts;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.changeTogglePosts = !state?.changeTogglePosts;
      });
  },
});

export const postsSelector = (state) => state?.posts;
export const postsReducer = postsSlice.reducer;

// * POSTS

export const fetchPosts = createAsyncThunk(
  "posts/fetchPostStatus",
  async ({ groupId, userID }) => {
    const { data } = await axios.get(
      `${API__SERVER}/forum/group/${groupId}/1/10/${userID}`
    );

    return data.list_posts;
  }
);

export const fetchDetailPost = createAsyncThunk(
  "posts/fetchDetailPost",
  async ({ groupId, postId }) => {
    const { data } = await axios.get(
      `${API__SERVER}/forum/group/detail_post/${postId}/${groupId}`
    );
    return data?.Posts;
  }
);

export const addLikePost = createAsyncThunk(
  "posts/addLikePostStatus",
  async ({ postId, userID }) => {
    const res = await axios
      .post(
        `${API__SERVER}/forum/favorite/${userID}/${postId}`,
        JSON.stringify({ type: 1 }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .catch((error) =>
        toast.error(error ?? "Có lỗi sảy ra xin vui lòng thử lại sau.")
      );
  }
);

export const addPost = createAsyncThunk(
  "posts/addPostStatus",
  async ({ data, userID }) => {
    const response = await axios
      .post(`${API__SERVER}/forum/add_post2/${userID}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("Post added successfully!");
        return true;
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message ??
            "Có lỗi sảy ra xin vui lòng thử lại sau."
        );
        return false;
      });
    return response;
  }
);

export const patchPost = createAsyncThunk(
  "posts/patchPostStatus",
  async ({ data, postID }) => {
    try {
      const response = await axios.patch(
        `${API__SERVER}/forum/update_post/${postID}`,
        data
      );

      toast.success("Post updated successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Có lỗi sảy ra xin vui lòng thử lại sau."
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePostStatus",
  async (postID) => {
    try {
      const response = await axios.delete(
        `${API__SERVER}/forum/delete_post/${postID}`
      );

      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ??
          "Có lỗi sảy ra xin vui lòng thử lại sau."
      );
    }
  }
);

// * COMMENTS

export const postComment = createAsyncThunk(
  "posts/postCommentStatus",
  async ({ PostID, data, userID }) => {
    const response = await axios
      .post(`${API__SERVER}/forum/add_comment/${userID}/${PostID}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message ??
            "Có lỗi sảy ra xin vui lòng thử lại sau."
        );
      });
  }
);

export const likeUnlikeComment = createAsyncThunk(
  "posts/likeUnlikeCommentStatus",
  async ({ commentID, userID }) => {
    const response = await axios
      .post(`${API__SERVER}/forum/comment/favorite/${userID}/${commentID}`)
      .catch((error) =>
        toast.error(
          error?.response?.data?.message ??
            "Có lỗi sảy ra xin vui lòng thử lại sau."
        )
      );
    return response.status === 200 ? true : false;
  }
);

export const removeComment = createAsyncThunk(
  "posts/removeCommentStatus",
  async (commentID) => {
    const response = await axios
      .delete(`${API__SERVER}/forum/comment/remove/${commentID}`)
      .catch((error) =>
        toast.error(
          error?.response?.data?.message ??
            "Có lỗi sảy ra xin vui lòng thử lại sau."
        )
      );
  }
);
