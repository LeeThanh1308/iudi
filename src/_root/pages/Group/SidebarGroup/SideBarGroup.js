import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormGroup from "./FormGroup";

import Logogroup from "../../../../images/logo-group.png";
import GroupItem from "./GroupItem";

import config from "../../../../configs/Configs.json";

import { MdArrowBackIos } from "react-icons/md";
import Swal from "sweetalert2";

import { Auth } from "../../../../service/utils/auth";
import Header1 from "../../../../components/Header/Header1";

const { API__SERVER } = config;

const SideBarGroup = ({ onLoading = () => null }) => {
  const [groupList, setGroupList] = useState([]);
  const [isChangeGroupList, setIsChangeGroupList] = useState(false);
  const { groupId } = useParams();
  const { userID } = new Auth();

  const navigate = useNavigate();

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
        onLoading(true);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchGroups();
  }, [isChangeGroupList]);

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

  return (
    <div className="text-white mobile:text-black lg:text-[16px] sm:text-[12px] text-[14px] w-full">
      {/* <Header1 /> */}
      <div className="flex items-center gap-2 mobile:hidden p-2">
        <button title="add group" onClick={handleShowModal}>
          <img
            className="w-[50px] h-auto object-cover ipad:w-[30px] "
            src={Logogroup}
            alt="logo group"
          />
        </button>
        <h2 className="uppercase">Group</h2>
      </div>

      <div className="relative hidden mobile:block font-roboto border-b border-[#00000080] p-3 text-center">
        <button
          className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl"
          type="button"
          onClick={() => navigate(-1)}
        >
          <MdArrowBackIos />
        </button>

        <h3 className="font-semibold text-xl">Nhóm</h3>
      </div>

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

      <FormGroup
        data={{
          showModal,
          onHidden: handleHiddenModal,
          onChangeGroups: handleToggleChangeGroupList,
        }}
      />
    </div>
  );
};

export default SideBarGroup;
