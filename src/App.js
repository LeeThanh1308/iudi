import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./_auth/AuthLayout.js";
import ForgotPassword from "./_auth/forms/ForgotPassword.js";
import SigninForm from "./_auth/forms/SigninForm.js";
import SignupForm from "./_auth/forms/SignupForm.js";

import RootLayout from "./_root/RootLayout.js";

import HomeLayout from "./_root/pages/HomeLayout/HomeLayout.js";
import Message from "./_root/pages/HomeLayout/Message/Message.js";
import Home from "./_root/pages/HomeLayout/Home/Home.js";
import MessageDetail from "./_root/pages/HomeLayout/Message/MessageDetail.js";

import Profile from "./_root/pages/Profile/Profile.js";
import Personal from "./_root/pages/Personal/Personal.js";
import Group from "./_root/pages/Group/Group.js";
import CreateInfoUser from "./_root/pages/CreateInfoUser/CreateInfoUser.js";
import Finding from "./_root/pages/Finding/Finding.js";
import Setting from "./_root/pages/Setting/Setting.js";

import Private from "./_root/pages/Setting/Private/Private.js";
// import Notification from "./_root/pages/Setting/Notification/Notification.js";
import About from "./_root/pages/Setting/About/About.js";
import Rules from "./_root/pages/Setting/Rules/Rules.js";
import Security from "./_root/pages/Setting/Security/Security.js";
import SettingLayout from "./_root/pages/Setting/SettingLayout.js";
import SideBarGroup from "./_root/pages/Group/SidebarGroup/SideBarGroup.js";
import FindingResult from "./_root/pages/Finding/FindingResult.js";
import PostDetail from "./_root/pages/Group/PostDetail/index.jsx";
import { Auth } from "./service/utils/auth.js";
import { useDispatch, useSelector } from "react-redux";
import { messagesSelector } from "./service/redux/messages/messagesSlice.js";
import { handleSendToastify } from "./service/utils/utils.js";
const socket = io("https://api.iudi.xyz");
function App() {
  const { userID } = new Auth();
  useEffect(() => {
    Notification.requestPermission();
    socket.emit("userId", { userId: userID });
    socket.on("check_message", (message) => {
      const { Content } = message.data;
      console.log("Succeeded..." + Content);
      handleSendToastify(Content);
    });
    // client connect to server
  }, []);
  return (
    <main>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<SignupForm />} />
          <Route path="/login" element={<SigninForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* private routes */}
        <Route element={<HomeLayout />}>
          <Route exact index element={<Home />} />
          <Route exact path="/message/" element={<Message />} />
          <Route exact path="/message/:id" element={<MessageDetail />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/personal" element={<Personal />} />

          <Route path="/group" element={<SideBarGroup />}></Route>
          <Route path="/group/:slug/:groupId" element={<Group />}></Route>
          <Route
            path="/group/:slug/:groupId/posts/:postId"
            element={<PostDetail />}
          ></Route>
          <Route path="/finding" element={<Finding />} />
          <Route path="/finding/result" element={<FindingResult />} />
        </Route>

        <Route path="/setting" element={<SettingLayout />}>
          <Route index element={<Setting />} />
          <Route path="private" element={<Private />} />
          {/* <Route path="notifi" element={<Notification />} /> */}
          <Route path="rules" element={<Rules />} />
          <Route path="about" element={<About />} />
          <Route path="security" element={<Security />} />
          <Route path="group" element={<SideBarGroup />} />
        </Route>

        <Route path="/create-info" element={<CreateInfoUser />} />
      </Routes>
    </main>
  );
}

export default App;
