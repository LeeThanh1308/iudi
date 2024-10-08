import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "./../../utils/auth";
import axios from "axios";
import io from "socket.io-client";
import config from "../../../configs/Configs.json";
import { data, info } from "autoprefixer";

const { API__SERVER } = config;
const socket = io("https://api.iudi.xyz");

const initialState = {
  messages: {
    data: [],
    info: {},
  },
  //  loading: 'idle',
  postToggle: false,
  historyMessages: [],
  isSeenMessage: false,
  toTotalNoSendMessage: 0,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,

  reducers: {
    handleUpdateDataMessage: (state, action) => {
      const isExist = state.messages.data.find(
        (data) => data.MessageID === action.payload.MessageID
      );
      if (!isExist) state.messages.data.push(action.payload);
    },
    handleGetHistoryMessage: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        const data = action.payload.map((item) => {
          const isExist = state.messages.data.find(
            (it) => it.MessageID === item.MessageID
          );
          // if (!isExist) state.messages.data.unshift(...action.payload);
          if (!isExist) return item;
        });
        state.messages.data.unshift(
          ...data.sort((a, b) => a.MessageID - b.MessageID)
        );
      }
    },
    handleClearMessages: (state, action) => {
      state.messages.data = [];
      state.messages.info = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(fetchHistoryMessages.fulfilled, (state, action) => {
        state.historyMessages = action?.payload?.data ?? [];
        state.toTotalNoSendMessage = action?.payload?.message_no_send ?? 0;
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        // const { userID } = new Auth();
        // const { idSend } = action?.meta?.arg;
        // if (idSend !== userID) {
        state.postToggle = !state.postToggle;
        // } else {
        //   state.postToggle = true;
        // }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.postToggle = !state.postToggle;
      })
      .addCase(postSeenMessage.fulfilled, (state, action) => {
        state.isSeenMessage = true;
      })
      .addCase(getRelationshipUsers.fulfilled, (state, action) => {})
      .addCase(handleChangeSeenMessages.fulfilled, (state, action) => {
        // state.postToggle = action.payload;
      });
  },
});

export const messagesSelector = (state) => state.messages;
export const messagesReducer = messagesSlice.reducer;

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessageStatus",
  async ({ otherUserId, userID, page = 1, limit = 15 }) => {
    const { data, info } = await axios
      .get(
        `${API__SERVER}/pairmessage/${userID}?other_userId=${otherUserId}&page=${page}&limit=${limit}`
      )
      .then((response) => response.data);
    return {
      data: data.sort((a, b) => a.MessageID - b.MessageID),
      info,
    };
  }
);

export const postMessage = createAsyncThunk(
  "messages/postMessageStatus",
  async (data) => {
    try {
      console.log(data);
      const { image, ...args } = data;
      const res = await socket.emit("send_message", args);
      if (image) {
        // console.log(image);
      }
      // console.log(res);
    } catch (error) {
      // console.log("error", error);
    }
  }
);

export const fetchHistoryMessages = createAsyncThunk(
  "messages/fetchHistory",
  async (userID) => {
    const { data } = await axios.get(`${API__SERVER}/chat/${userID}`);

    // console.log(list_message_no_read);
    return {
      data: data.data,
      message_no_send:
        data.list_message_no_read?.all_message_user_receiver_no_read ?? 0,
    };
  }
);

export const getRelationshipUsers = createAsyncThunk(
  "messages/getRelations",
  async (userID) => {
    try {
      const res = await axios.get(`${API__SERVER}/chatblock/${userID}`);
      return res.data.data;
    } catch (error) {
      // console.log("error", error);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async ({ messageID, userID }) => {
    // console.log(messageID);
    const res = await fetch(`${API__SERVER}/chat/${userID}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId: messageID,
      }),
    });
  }
);

export const postSeenMessage = createAsyncThunk(
  "messages/postSeenMessage",
  async (messageID) => {
    try {
      const res = await socket.emit("seen", { MessageID: messageID });
    } catch (error) {
      // console.log(error);
    }
  }
);

export const handleChangeSeenMessages = createAsyncThunk(
  "messages/hanldeChangeSeenMessageAll",
  async ({ SenderID, ReceiverID }) => {
    console.log(SenderID, ReceiverID);
    const response = await axios
      .post(`${API__SERVER}/message/mark_as_read`, { SenderID, ReceiverID })
      .then(() => true)
      .catch(() => false);
    return response.data;
  }
);

export const {
  handleUpdateDataMessage,
  handleGetHistoryMessage,
  handleClearMessages,
} = messagesSlice.actions;
