import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";

import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import { ToastContainer } from "react-toastify";

import Header3 from "../../../components/Header/Header3";
import SideBarGroup from "./SidebarGroup/SideBarGroup";
import background from "../../../images/background.jpg";
import GroupImages from "./GroupImages/GroupImages";
import GroupDetail from "./GroupDetail/GroupDetail";

import { handleErrorImgSlideGroup } from "../../../service/utils/utils";

import { Auth } from "../../../service/utils/auth";

import config from "../../../configs/Configs.json";
const { URL_BASE64, API__SERVER } = config;

const Group = () => {
  const [heightHeader, setHeightHeader] = useState(100);
  const [page, setPage] = useState(1);
  const [widthSidebar, setWidthSidebar] = useState(500);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [groupInfo, setGroupInfo] = useState({
    avatarLink: "",
    groupName: "",
  });
  console.log(groupInfo);
  const { avatarLink, GroupName: groupName } = groupInfo;
  // get members from group

  const { groupId } = useParams();
  const { userID } = new Auth();

  const [memberCount, setMemberCount] = useState(0);
  const sidebarRef = useRef();

  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    minHeight: "100vh",
  };

  const sidebarStyles = {
    position: "fixed",
    top: `${heightHeader}px`,
    left: "0",
    height: `calc(100vh - ${heightHeader}px)`,
  };

  const mainStyles = {
    width: `calc(100% - ${widthSidebar}px)`,
    marginLeft: `${widthSidebar}px`,
    marginTop: `${heightHeader}px`,
  };

  // const { state } = useLocation()

  useLayoutEffect(() => {
    //Get info group
    axios
      .get(`https://api.iudi.xyz/api/detail_group/${groupId}/1`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data?.detailGroup);
        if (data?.detailGroup) {
          setGroupInfo(data.detailGroup);
        }
      })
      .catch(() => {});
  }, [groupId]);
  useEffect(() => {
    setTimeout(() => {
      isLoadingSidebar && setWidthSidebar(sidebarRef?.current.offsetWidth);
    }, 300);
  }, [isLoadingSidebar]);

  const handleGetHeightHeder = (number) => setHeightHeader(number);
  const getIsLoadingSidebar = (value) => setIsLoadingSidebar(value);

  useEffect(() => {
    window.onscroll = () => {
      document.documentElement.scrollTop > 0
        ? setIsDark(true)
        : setIsDark(false);
    };
  }, []);

  const fetchMembersGroup = async (groupId) => {
    const res = await axios
      .get(`${API__SERVER}/forum/list_member_group/${groupId}`)
      .catch((err) => {});
    if (res?.data?.data) setMemberCount(res?.data?.data?.length);
  };

  useEffect(() => {
    groupId && fetchMembersGroup(groupId);
  }, [groupId]);

  const handleJoinGroup = async () => {
    if (!userID) {
      Swal.fire({
        title: "Not logged in yet",
        text: "Please log in to your account!",
        icon: "info",
      });

      return;
    }

    Swal.fire({
      title: "Are you join?",
      text: "You will have to follow the group rules",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "Welcome to us!",
          icon: "success",
        });

        fetch(`${API__SERVER}/forum/user_join_group/${userID}/${groupId}`, {
          method: "post",
        });

        isCheckMember();
        fetchMembersGroup(groupId);
      }
    });
  };

  const handleLeaveGroup = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not see posts in this group",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "you have left the group",
          icon: "success",
        });

        fetch(`${API__SERVER}/forum/user_leave_group/${userID}/${groupId}`, {
          method: "post",
        });

        isCheckMember();
        fetchMembersGroup(groupId);
      }
    });
  };

  const [isMember, setIsMember] = useState(false);

  const isCheckMember = async () => {
    const res = await axios
      .post(
        `https://api.iudi.xyz/api/forum/check_member_group/${userID}/${groupId}`
      )
      .catch(() => {});
    if (res?.data) {
      const isMember = res?.data?.message === "You are in group" ? true : false;
      setIsMember(isMember);
    }
  };

  useEffect(() => {
    groupId && userID && isCheckMember();
  }, [groupId]);

  return (
    <>
      <div
        className="flex flex-col justify-between w-full mobile:hidden "
        style={backgroundImageStyle}
      >
        <Header3 isDark={isDark} onGetHeight={handleGetHeightHeder} />
        <div>
          <div
            ref={sidebarRef}
            style={sidebarStyles}
            id="sidebar-group"
            className="p-5 overflow-y-auto overflow-x-hidden ipad:w-[150px] max-w-[300px] lg:max-w-[400px] w-max mobile:hidden"
          >
            <SideBarGroup onLoading={getIsLoadingSidebar} />
          </div>

          <div style={mainStyles} className="text-white p-5">
            <div>
              <div>
                <img
                  className="w-full object-fill max-h-[400px]"
                  src={`${avatarLink}`}
                  alt="slide group"
                  onError={(e) => handleErrorImgSlideGroup(e.target)}
                />
              </div>

              <div className="flex justify-between bg-[#008748] p-3 items-center">
                <div>
                  <h3 className="text-xl ipad:text-lg capitalize">
                    {groupName}
                  </h3>
                  <p className="text-[#bdbdbd] text-sm">
                    {memberCount} thành viên
                  </p>
                </div>

                <div className="mr-5">
                  {!isMember ? (
                    <button
                      type="button"
                      className=" text-sm bg-[#4EC957] p-2 rounded-[6px]"
                      onClick={handleJoinGroup}
                    >
                      Tham gia nhóm
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="ml-3 text-sm bg-[#FF685F] p-2 rounded-[6px]"
                      onClick={handleLeaveGroup}
                    >
                      Rời nhóm
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid 2xl:grid-cols-2 grid-cols-1 py-5 gap-3">
              <GroupDetail />
              <GroupImages />
            </div>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="hidden mobile:block">
        <GroupDetail />
      </div>

      <ToastContainer />
    </>
  );
};
export default Group;
