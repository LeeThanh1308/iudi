import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Header3 from "../../../components/Header/Header3";
import Logogroup from "../../../images/logo-group.png";
import background from "../../../images/background.jpg";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Auth } from "../../../service/utils/auth";
import Swal from "sweetalert2";
import axios from "axios";
import config from "./../../../configs/Configs.json";
import FormGroup from "../Group/SidebarGroup/FormGroup";
import GroupItem from "../Group/SidebarGroup/GroupItem";
import {
  handleErrorImgSlideGroup,
  slugString,
} from "../../../service/utils/utils";
import LazyLoad from "react-lazy-load";
const { API__SERVER } = config;

function Group2() {
  const { userID } = new Auth();
  const { groupId } = useParams();
  const [isDark, setIsDark] = useState(0);
  const [groupList, setGroupList] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [listPhotos, setListPhotos] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [heightHeader, setHeightHeader] = useState(0);
  const [isShowScrollbar, setShowScrollbar] = useState(false);
  const [isChangeGroupList, setIsChangeGroupList] = useState(false);
  // Baneer
  const [groupInfo, setGroupInfo] = useState({
    avatarLink: "",
    groupName: "",
  });
  const { avatarLink, GroupName: groupName } = groupInfo;
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

  const fetchMembersGroup = async (groupId) => {
    const res = await axios
      .get(`${API__SERVER}/forum/list_member_group/${groupId}`)
      .catch((err) => {});

    if (res?.data?.data) setMemberCount(res?.data?.data?.length);
  };
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${API__SERVER}/forum/group/all_group`
        );
        // const grouptListSort = response.data.data.sort(
        //  (a, b) => b.GroupID - a.GroupID
        // )
        setGroupList(response.data.data);
        // onLoading(true);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchGroups();
    isCheckMember();
  }, [isChangeGroupList]);

  useEffect(() => {
    window.onscroll = () => {
      document.documentElement.scrollTop > 0
        ? setIsDark(true)
        : setIsDark(false);
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const handleHiddenModal = () => setShowModal(false);
  const handleShowModal = () => {
    if (!userID) {
      Swal.fire({
        title: "Not logged in yet",
        text: "Please log in to your account!",
        icon: "info",
      });

      return;
    }
    setShowModal(true);
  };
  const handleToggleChangeGroupList = () =>
    setIsChangeGroupList((prevState) => !prevState);

  useLayoutEffect(() => {
    //Get info group
    axios
      .get(`https://api.iudi.xyz/api/detail_group/${groupId}/1`)
      .then((res) => res.data)
      .then((data) => {
        const { detailGroup } = data;
        if (detailGroup) {
          setGroupInfo(data.detailGroup);
          if (
            Array.isArray(detailGroup?.photoPost) &&
            detailGroup?.photoPost.length > 0
          ) {
            setListPhotos(detailGroup?.photoPost);
          }
        }
      })
      .catch(() => {});

    fetchMembersGroup(groupId);
    isCheckMember();
  }, [groupId]);
  // console.log(listPhotos);
  return (
    <div
      className="w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div className="relative">
        <Header3
          isDark={isDark}
          onGetHeight={(value) => setHeightHeader(value)}
        />
      </div>
      <div
        style={{
          marginTop: heightHeader + "px",
        }}
        className="flex min-h-screen"
      >
        <div
          className=" flex-1 w-full overflow-hidden relative"
          onMouseMove={() => setShowScrollbar(true)}
          onMouseLeave={() => setShowScrollbar(false)}
        >
          <div
            className={`w-full absolute top-0 left-0 bottom-0 overflow-x-hidden ${
              isShowScrollbar ? "overflow-y-auto" : "overflow-y-hidden"
            }`}
            id="scrollbar"
          >
            <div
              onClick={handleShowModal}
              className="flex items-center gap-2 mobile:hidden p-2 w-full hover:bg-white rounded-xl"
            >
              <button title="add group">
                <img
                  className="w-[40px] h-auto object-cover ipad:w-[30px] "
                  src={Logogroup}
                  alt="logo group"
                />
              </button>
              <h2 className="uppercase">Add Group</h2>
            </div>
            {/* List Group */}
            <div className=" w-full">
              <ul className="mt-5 mobile:px-3 mobile:pb-[30px]">
                {groupList.map(({ GroupID, avatarLink, GroupName }) => {
                  return (
                    <GroupItem
                      key={GroupID}
                      data={{
                        GroupID,
                        avatarLink,
                        GroupName,
                        idParams: groupId,
                      }}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-[6] w-full">
          {groupName && (
            <div>
              <div>
                <img
                  className="w-full object-center max-h-[400px]"
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
          )}

          <div className=" w-full flex gap-4">
            <div className="flex-[3] min-h-screen">
              <Outlet />
            </div>
            {Array.isArray(listPhotos) && listPhotos.length > 0 && (
              <div className="flex-1 w-full h-screen relative mt-3">
                <div className="p-3 bg-[#18191a] rounded-md mx-auto">
                  <div className="bg-[#242526] rounded p-2">
                    <div className="flex justify-between mb-2">
                      <h5>Ảnh</h5>
                    </div>
                    {/* <div className="w-full min-h-screen overflow-hidden relative">
                      <div
                        id="scrollbar"
                        className="grid grid-cols-2 gap-4 absolute top-0 right-0 bottom-0 left-0 overflow-x-hidden overflow-y-hidden hover:overflow-y-auto"
                      >
                        {Array.isArray(listPhotos) &&
                          listPhotos.length > 0 &&
                          listPhotos.map((item, i) => {
                            return (
                              <div
                                className="aspect-square overflow-hidden"
                                key={i}
                              >
                                <Link
                                  to={`/group/${slugString(
                                    groupName
                                  )}/${groupId}/threads/${item?.PhotoID}/${
                                    item?.PostID
                                  }`}
                                  className="block aspect-square overflow-hidden"
                                >
                                  <img
                                    src={item?.photo_link}
                                    alt="Gallery"
                                    className="w-full h-full object-cover"
                                  />
                                </Link>
                              </div>
                            );
                          })}
                      </div>
                    </div> */}

                    <div className="w-full h-screen overflow-hidden relative">
                      <div
                        id="scrollbar"
                        className="flex flex-wrap content-start basis-[50%] absolute top-0 right-0 bottom-0 left-0 overflow-y-auto overflow-x-hidden"
                      >
                        {Array.isArray(listPhotos) &&
                          listPhotos.length > 0 &&
                          listPhotos.map((item, i) => {
                            return (
                              <div
                                className="w-1/2 aspect-square overflow-hidden p-1"
                                key={i}
                              >
                                <Link
                                  to={`/group/${slugString(
                                    groupName
                                  )}/${groupId}/threads/${item?.PhotoID}/${
                                    item?.PostID
                                  }`}
                                  className="block aspect-square overflow-hidden"
                                >
                                  <img
                                    src={item?.photo_link}
                                    alt="Gallery"
                                    className="w-full h-full object-cover"
                                  />
                                </Link>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FormGroup
        data={{
          showModal,
          onHidden: handleHiddenModal,
          onChangeGroups: handleToggleChangeGroupList,
        }}
      />
    </div>
  );
}

export default Group2;
