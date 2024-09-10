import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import config from "../../configs/Configs.json";
import { Auth } from "../../service/utils/auth";
import Navbar from "./Navbar";

import { handleErrorImg } from "../../service/utils/utils";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  usersSelector,
} from "../../service/redux/users/usersSlice";

const { URL_BASE64 } = config;

const Header2 = (props) => {
  const { onGetHeight, isPositionFixed, isDark } = props;
  const { userName } = new Auth();

  const headerRef = useRef();

  const { user, isToggleChangeUser } = useSelector(usersSelector);
  // console.log(user, isToggleChangeUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile(userName));
  }, [isToggleChangeUser]);

  useLayoutEffect(() => {
    onGetHeight && onGetHeight(headerRef?.current.offsetHeight);
  }, [props]);

  return (
    <div
      ref={headerRef}
      id="header2"
      className={`${isPositionFixed && "left-0 right-0 z-10 fixed"} ${
        isDark ? "bg-black" : "bg-transparent"
      } flex items-center justify-between text-white border-b border-solid border-b-white overflow-y-auto transition-all duration-200`}
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

      <Navbar />
    </div>
  );
};
export default Header2;
