import { Button, IconButton } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { slugString } from "../../service/utils/utils";

import { Auth } from "../../service/utils/auth";

import { FaHome, FaLayerGroup } from "react-icons/fa";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { FaUsersViewfinder, FaPeopleGroup } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";

const Navbar = () => {
  const { isLogin, userName } = new Auth();
  const navigate = useNavigate();

  const [groupFirst, setGroupFirst] = useState({});
  const [isGetGroupFirst, setIsGetGroupFirst] = useState(false);

  const { GroupName, GroupID, avatarLink } = groupFirst;

  const navList = [
    {
      name: "Home",
      link: "/",
      id: 1,
      icon: <FaHome />,
    },

    isLogin && {
      name: "Finding",
      link: "/finding",
      id: 2,
      icon: <FaUsersViewfinder />,
    },

    isLogin && {
      name: "Profile",
      link: `/profile/${userName}`,
      id: 3,
      icon: <GiPlagueDoctorProfile />,
    },

    // isGetGroupFirst &&
    isLogin && {
      name: "Group",
      id: 4,
      link: `/group`,
      icon: <FaLayerGroup />,
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure ?")) {
      localStorage.clear();
      navigate("/");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef();

  const handleToggleSidebar = () => {
    if (sidebarRef.current.offsetWidth === 0) {
      setShowSidebar(true);
    } else {
      setShowSidebar(false);
    }
  };

  return (
    <div className="flex items-center gap-4 ">
      <div className="hidden mr-4 lg:block" onMouseEnter={(e) => e.target}>
        <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
          {navList.map((items) => {
            if (!items) return null;
            const { id, name, link } = items;
            return (
              <li key={id}>
                {name === "Group" ? (
                  <Link
                    state={{ avatarLink, groupName: GroupName }}
                    className="p-1 font-normal"
                    to={link}
                  >
                    {name}
                  </Link>
                ) : (
                  <Link className="p-1 font-normal" to={link}>
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center gap-x-1">
        {!isLogin ? (
          <Button
            variant="text-white"
            size="sm"
            className="hidden mr-4 lg:inline-block"
            onClick={() => navigate("/login")}
          >
            <span>Log In</span>
          </Button>
        ) : (
          <Button
            variant="text-white"
            size="sm"
            className="hidden mr-4 lg:inline-block"
            onClick={handleLogout}
          >
            <span>Log Out</span>
          </Button>
        )}

        {!isLogin && (
          <Button
            variant="gradient"
            size="sm"
            className="hidden mr-4 lg:inline-block"
            onClick={() => navigate("/register")}
          >
            <span>Sign up</span>
          </Button>
        )}
      </div>
      <div className={`mr-3 lg:hidden `}>
        <button onClick={handleToggleSidebar} type="" className="text-2xl">
          <TiThMenu />
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`${
          showSidebar ? "w-[300px] opacity-1" : "w-0 opacity-0"
        } z-10 transition-all duration-300 overflow-hidden h-[100vh] bg-black fixed top-0 right-0`}
      >
        <ul className="px-3">
          <div className="flex justify-end pt-3 text-xl">
            <button type="" onClick={handleToggleSidebar}>
              <IoMdClose />
            </button>
          </div>

          {navList.map((items) => {
            if (!items) return null;
            const { id, name, link, icon } = items;
            return (
              <li
                key={id}
                className="flex items-center gap-2 py-2 duration-100 hover:bg-gray-800"
              >
                {icon}
                <Link to={link}>{name}</Link>
              </li>
            );
          })}

          {!isLogin ? (
            <div>
              <Button
                variant="text-white"
                className="mb-3"
                size="sm"
                onClick={() => navigate("/login")}
              >
                <span>Log In</span>
              </Button>
            </div>
          ) : (
            <div>
              <Button
                className="mb-3"
                variant="text-white"
                size="sm"
                onClick={handleLogout}
              >
                <span>Log Out</span>
              </Button>
            </div>
          )}

          {!isLogin && (
            <div>
              <Button
                className="mb-3"
                variant="gradient"
                size="sm"
                onClick={() => navigate("/register")}
              >
                <span>Sign up</span>
              </Button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
