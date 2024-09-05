import axios from "axios";
import React, { useEffect, useState } from "react";

import { Auth } from "../../../service/utils/auth";

import MessageBlock from "./MessageBlock";

const PersonalPrivate = () => {
  const { userID, userName } = new Auth();

  const [isPrivate, setIsPrivate] = useState(false);
  const [isStatus, setIsStatus] = useState(true);
  const [isWatched, setIsWatched] = useState(true);
  const [isBlockChat, setIsBlockChat] = useState(true);

  const handleChangeStatus = () => {
    setIsStatus(!isStatus);
  };

  const handleChangeWatched = () => {
    setIsWatched(!isWatched);
  };

  const handleBlockChat = () => {
    setIsBlockChat(!isBlockChat);
  };

  // *_____________  private

  useEffect(() => {
    fetchProfile(userName);
  }, [userName]);

  const fetchProfile = async (userName) => {
    const response = await axios.get(
      `https://api.iudi.xyz/api/profile/${userName}`
    );

    const newIsPrivate = response.data.Users[0].IsPrivate === 1 ? true : false;
    setIsPrivate(newIsPrivate);
  };

  const handleChangePrivate = async () => {
    try {
      const res = await axios.post(
        `https://api.iudi.xyz/api/profile/change_private/${userID}`
      );

      fetchProfile(userName);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pc:col-span-2 col-span-1 bg-[#252525] border border-[#4EC957] rounded-lg p-5">
      <h1 className="text-[28px] font-semibold text-white text-center">
        Quyền riêng tư
      </h1>

      <div>
        {/* status */}
        <div className="flex mt-3 gap-4">
          <h5 className="text-white w-[215px]">Hiển thị trạng thái truy cập</h5>

          <div>
            <button
              onClick={handleChangeStatus}
              className={`${
                isStatus
                  ? "bg-[#008748] border border-[#008748]"
                  : "bg-gray-700 border border-gray-700"
              } transition-all duration-200 flex overflow-hidden w-[70px] h-[30px] rounded-full p-1 items-center`}
              type="button"
            >
              <div
                className={`${
                  isStatus ? "ml-[34px]" : ""
                } duration-200 transition-all w-[23px] h-[23px] bg-white rounded-full flex`}
              ></div>
            </button>
          </div>
        </div>

        {/* Private */}

        <div className="flex mt-3 gap-4">
          {/* <h5 className='text-white w-[215px]'>Hiển thị trạng thái ẩn danh</h5> */}

          {/* <div>
      <button
       onClick={handleChangePrivate}
       className={`${
        isPrivate
         ? 'bg-[#008748] border border-[#008748]'
         : 'bg-gray-700 border border-gray-700'
       } transition-all duration-200 flex overflow-hidden w-[70px] h-[30px] rounded-full p-1 items-center`}
       type='button'
      >
       <div
        className={`${
         isPrivate ? 'ml-[34px]' : ''
        } duration-200 transition-all w-[23px] h-[23px] bg-white rounded-full flex`}
       ></div>
      </button>
     </div> */}
        </div>

        {/*Watched  */}
        <div className="flex mt-3 gap-4">
          <h5 className="text-white w-[215px]">Hiển thị trạng thái đã xem</h5>

          <div>
            <button
              onClick={handleChangeWatched}
              className={`${
                isWatched
                  ? "bg-[#008748] border border-[#008748]"
                  : "bg-gray-700 border border-gray-700"
              } transition-all duration-200 flex overflow-hidden w-[70px] h-[30px] rounded-full p-1 items-center`}
              type="button"
            >
              <div
                className={`${
                  isWatched ? "ml-[34px]" : ""
                } duration-200 transition-all w-[23px] h-[23px] bg-white rounded-full flex`}
              ></div>
            </button>
          </div>
        </div>

        {/* Block message */}
        <div className="flex gap-4 mt-3">
          <h5 className="text-white w-[215px]">Từ chối nhận tin nhắn</h5>

          <div>
            <button
              onClick={handleBlockChat}
              className={`${
                isBlockChat
                  ? "bg-[#008748] border border-[#008748]"
                  : "bg-gray-700 border border-gray-700"
              } transition-all duration-200 flex overflow-hidden w-[70px] h-[30px] rounded-full p-1 items-center`}
              type="button"
            >
              <div
                className={`${
                  isBlockChat ? "ml-[34px]" : ""
                } duration-200 transition-all w-[23px] h-[23px] bg-white rounded-full flex`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 gap-4">
        <h5 className="text-white">Chặn tin nhắn</h5>

        <div className="bg-[#262D34] rounded-xl p-5 overflow-y-auto max-h-[450px] mt-4">
          <MessageBlock />
        </div>
      </div>
    </div>
  );
};

export default PersonalPrivate;
