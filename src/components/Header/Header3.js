import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Logo from "../../images/logoApp.png";

import config from "../../configs/Configs.json";
import { Auth } from "../../service/utils/auth";
import Navbar from "./Navbar";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  usersSelector,
} from "../../service/redux/users/usersSlice";
import { handleErrorImg } from "../../service/utils/utils";

const { URL_BASE64 } = config;

const Header3 = (props) => {
  const { userName } = new Auth();

  const userState = useSelector(usersSelector);
  const { user, isToggleChangeUser } = userState;
  const dispatch = useDispatch();

  const styles = {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: props?.isDark ? "black" : "transparent",
    transition: ".3s ease-in-out",
  };

  useEffect(() => {
    userName && dispatch(fetchProfile(userName));
  }, [isToggleChangeUser]);

  const headerRef = useRef();
  useLayoutEffect(() => {
    props?.onGetHeight(headerRef.current.offsetHeight);
  }, []);

  return (
    <div
      ref={headerRef}
      id="header3"
      className="left-0 right-0 z-10 flex items-center justify-between text-white border-b border-solid border-b-white"
      style={styles}
    >
      <div className="flex items-center gap-2">
        <Link
          to={`/profile/${userName}`}
          className="w-20 h-20 overflow-hidden m-[15px] rounded-[50%]"
        >
          <img
            src={`${user.avatarLink}`}
            alt="avatar"
            className="w-full h-full object-cover"
            onError={(e) => handleErrorImg(e.target)}
          />
        </Link>

        <h3 className="capitalize">{user.FullName}</h3>
      </div>

      <div>
        <img src={Logo} alt="logo" />
      </div>

      <Navbar />
    </div>
  );
};
export default Header3;
