import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions } from "react-icons/md";
import { RiAttachment2, RiSendPlane2Fill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  deleteMessage,
  fetchMessages,
  handleUpdateDataMessage,
  messagesSelector,
  postMessage,
  postSeenMessage,
  handleGetHistoryMessage,
  fetchHistoryMessages,
} from "../../../../service/redux/messages/messagesSlice";

import MessageDetailItem from "./MessageDetailItem";

import callPhone from "../../../../images/icons/callphone.png";
import callVideo from "../../../../images/icons/callvideo.png";

import { Auth } from "../../../../service/utils/auth";
import { handleErrorImg } from "../../../../service/utils/utils";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";

import config from "../../../../configs/Configs.json";
import { data } from "autoprefixer";
const { URL_BASE64, API__SERVER } = config;
const socket = io("https://api.iudi.xyz");

const MessageDetail = () => {
  const { id } = useParams();
  const { userID } = new Auth();

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPage, setPrevPage] = useState(1);
  const [onScrollBotton, setOnScrollBotton] = useState(true);
  const [endHistory, setEndHistory] = useState(false);
  const { userName, isOnline, avatar } = location.state;
  const messRef = useRef();
  const [messageForm, setMessageForm] = useState("");

  const { messages, postToggle } = useSelector(messagesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMessages({ otherUserId: id, userID }));
  }, [id, postToggle]);

  useEffect(() => {
    // client connect to server
    socket.emit("userId", { userId: userID });

    socket.on("check_message", (message) => {
      const { ReceiverID, SenderID, ...args } = message.data;
      dispatch(fetchMessages({ otherUserId: SenderID, userID: ReceiverID }));
      dispatch(fetchHistoryMessages(ReceiverID));
      setTimeout(() => {
        setOnScrollBotton((prev) => (prev = true));
      }, 2000);
      // console.table({ ReceiverID, SenderID, args });
    });
  }, [userID]);

  useEffect(() => {
    if (onScrollBotton) {
      messRef.current.scrollTop = messRef.current.scrollHeight;
      messRef.current.focus();
      setOnScrollBotton((prev) => !prev);
    }
  }, [messages, onScrollBotton]);

  useEffect(() => {
    handleLoadHistoryMessage();
  }, [prevPage]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (messageForm.trim() !== "" || imageUrl !== null) {
      const data = {
        content: messageForm === "" ? null : messageForm.trim(),
        idReceive: parseInt(id),
        idSend: userID,
        MessageTime: new Date(),
        Image: imageUrl,
      };

      await dispatch(postMessage(data));
      dispatch(fetchHistoryMessages(userID));
      axios
        .get(
          `${API__SERVER}/pairmessage/${userID}?other_userId=${
            data.idReceive
          }&page=${1}&limit=${1}`
        )
        .then((response) => response.data)
        .then((data) => dispatch(handleUpdateDataMessage(data.data[0])))
        .then(() => {
          setOnScrollBotton(true);
        })
        .catch(() => {});
      setMessageForm("");
      setImageUrl(null);
    }
  };

  const handleDeleteMessage = async (messageID) => {
    dispatch(deleteMessage({ messageID, userID }));
  };

  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Url = reader.result.split(",")[1];
      if (base64Url !== imageUrl) {
        setImageUrl(base64Url);
      }
    };
  };

  const [showEmoji, setShowEmoji] = useState(false);

  const handleClickEmoji = (data) => {
    setMessageForm((value) => value + data.emoji);
    setShowEmoji(false);
  };

  const handleScrollHistoryMgs = (e) => {
    const scrollTop = e.target.scrollTop;
    const containerHeight = e.target.scrollHeight - e.target.clientHeight;
    const triggerHeight = containerHeight * 0.25;
    console.table({
      scrollTop,
      containerHeight,
      triggerHeight,
      isLoading,
      onScrollBotton,
      isTrue: scrollTop <= triggerHeight,
    });
    if (scrollTop && scrollTop <= triggerHeight && !isLoading) {
      setPrevPage((prevPage) => prevPage + 1); // Tăng trang khi cuộn lên 25%
    }
  };

  const handleLoadHistoryMessage = async () => {
    if (messages?.data?.length > 0) {
      setIsLoading(true);
      await axios
        .get(
          `${API__SERVER}/pairmessage/${userID}?other_userId=${id}&page=${prevPage}&limit=30`
        )
        .then((response) => response.data)
        .then((data) => {
          const dataMessage = data?.data;
          if (dataMessage) {
            if (Array.isArray(dataMessage) && dataMessage.length === 0) {
              setEndHistory(true);
            }
            dispatch(handleGetHistoryMessage(dataMessage));
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="pb-5 bg-white rounded-3xl h-full flex flex-col">
      <div className="flex mobile:p-3 p-5 items-center justify-between border-b-[#817C7C] border-b border-solid">
        <div className="flex items-center gap-2">
          <Link to="/message">
            <button className="hidden w-6 h-6 text-black mobile:block ipad:block ">
              <ChevronLeftIcon />
            </button>
          </Link>

          <Link to={`/profile/${userName}`}>
            <img
              className="w-[66px] h-[66px] mobile:w-[50px] mobile:h-[50px] rounded-full object-cover"
              src={`${URL_BASE64}${avatar}`}
              alt="avatar default"
              onError={(e) => handleErrorImg(e.target)}
            />
          </Link>

          <div className="flex flex-col justify-center text-black">
            <h5 className="text-2xl font-bold capitalize mobile:text-lg mobile:fold-semibold">
              {userName}
            </h5>

            <p className={isOnline ? `text-[#008748]` : "text-gray"}></p>

            <p
              className={`text-xs ${isOnline ? `text-[#008748]` : "text-gray"}`}
            >
              {isOnline ? "Đang hoạt động" : "Đang Offline"}
            </p>
          </div>
        </div>

        {/* <div className='flex gap-5'>
     <div>
      <img
       className='w-[35px] h-[35px] object-cover mobile:w-[25px] mobile:h-[25px]'
       src={callVideo}
       alt='call video'
      />
     </div>

     <div>
      <img
       className='w-[35px] h-[35px] object-cover mobile:w-[25px] mobile:h-[25px]'
       src={callPhone}
       alt='call phone'
      />
     </div>
    </div> */}
      </div>

      <div
        className="flex-1 text-white p-[20px] overflow-y-auto "
        ref={messRef}
        tabIndex={0}
        onScroll={(e) => {
          if (!onScrollBotton && !endHistory) handleScrollHistoryMgs(e);
        }}
      >
        {messages?.data?.length > 0
          ? messages?.data.map(
              ({
                SenderID = 1,
                MessageID,
                Content,
                MessageTime,
                IsSeen,
                Image,
              }) => {
                SenderID === parseInt(id) &&
                  IsSeen === 0 &&
                  dispatch(postSeenMessage(MessageID));
                return (
                  <MessageDetailItem
                    key={MessageID}
                    data={{
                      SenderID,
                      OtherAvatar: messages?.info?.OtherAvatar,
                      MessageID,
                      Content,
                      MessageTime,
                      idParams: id,
                      IsSeen,
                      Image,
                      handleDeleteMessage,
                    }}
                  />
                );
              }
            )
          : ""}
      </div>

      <div>
        <form
          onSubmit={handleSubmitForm}
          className="relative flex flex-col justify-between mobile:p-3 ipad:p-2 tablet:p-3 p-5 m-3 border text-black mobile:rounded-[30px] rounded-[50px] border-solid border-[#4EC957]"
        >
          {imageUrl && (
            <div className="relative max-w-max">
              <img
                className="w-[50px] h-[50px] mobile:w-[30px] mobile:h-[30px] object-cover rounded duration-150"
                src={`${URL_BASE64}${imageUrl}`}
                alt="sendImage"
              />

              <button
                className="absolute right-[-10px] top-[-10px] mobile:right-[-5px] mobile:top-[-5px] text-xl mobile:text-sm"
                onClick={() => setImageUrl(null)}
              >
                <IoIosCloseCircle />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <input
              className="flex flex-1 mr-5 mobile:mr-2 mobile:max-w-[70%] mobile:flex-0 focus-visible:outline-none bg-[white] text-black"
              type="text"
              placeholder="Hãy gửi lời chào..."
              onChange={(e) => setMessageForm(e.target.value)}
              value={messageForm}
            />

            <div className="ml-3 mobile:gap-1 mobile:ml-0 mobile:text-[xl] flex gap-3 items-center mobile:text-xl text-[32px] text-[#008748]">
              <div className="relative flex">
                <button
                  type="button"
                  onClick={() => setShowEmoji((value) => !value)}
                >
                  <MdEmojiEmotions />
                </button>

                {showEmoji && (
                  <div className="absolute bottom-[100%] mobile:right-[-50px] right-0">
                    <EmojiPicker width="15em" onEmojiClick={handleClickEmoji} />
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  onChange={handleImageChange}
                  type="file"
                  className="w-[32px] mobile:w-[20px] opacity-0 z-10 relative"
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <RiAttachment2 />
                </div>
              </div>

              <button type="submit h-[32px] w-[32px] mobile:h-[20px] mobile:w-[20px]">
                <RiSendPlane2Fill />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageDetail;
