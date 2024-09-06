import React, { useEffect, useRef, useState } from "react";
import { Link, redirect, useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions } from "react-icons/md";
import { LuArrowBigUpDash } from "react-icons/lu";
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
import LazyLoad from "react-lazy-load";
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
  const [imageUrl, setImageUrl] = useState(null);
  const [fileImage, setFileImage] = useState();
  const messRef = useRef();

  const inputSendMessageRef = useRef();
  const [messageForm, setMessageForm] = useState("");

  const { messages, postToggle } = useSelector(messagesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMessages({ otherUserId: id, userID }));
  }, [id, postToggle]);

  // console.log(id);

  useEffect(() => {
    // client connect to server
    socket.emit("userId", { userId: userID });

    socket.on("check_message", async (message) => {
      console.log(message.data);
      const { ReceiverID, SenderID } = message.data;

      // console.table({ReceiverID, SenderID, id});
      // if (id === SenderID) {
      await dispatch(
        fetchMessages({ otherUserId: SenderID, userID: ReceiverID })
      );
      await dispatch(fetchHistoryMessages(ReceiverID));
      setTimeout(() => {
        setOnScrollBotton((prev) => !prev);
      }, 500);
      // }
    });
  }, [userID, id]);

  useEffect(() => {
    // if (onScrollBotton) {
    messRef.current.scrollTop = messRef.current.scrollHeight;

    messRef.current.focus();
    setOnScrollBotton((prev) => !prev);
    // }
  }, [messages]);

  useEffect(() => {
    inputSendMessageRef.current.focus();
  }, [imageUrl]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (messageForm.trim() !== "" || imageUrl !== null) {
      const data = {
        content: messageForm === "" ? null : messageForm.trim(),
        idReceive: parseInt(id),
        idSend: userID,
        MessageTime: new Date(),
      };
      setMessageForm("");
      if (fileImage) {
        await axios
          .post(
            `${API__SERVER}/uploadimage/${userID}`,
            {
              idReceive: Number(id),
              imageLink: fileImage,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .finally(() => {
            setFileImage("");
            setImageUrl(null);
          });
      }
      await dispatch(postMessage(data));
      // dispatch(fetchHistoryMessages(userID));
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
          inputSendMessageRef.current.focus();
        })
        .catch(() => {});
    }
  };

  const handleDeleteMessage = async (messageID) => {
    dispatch(deleteMessage({ messageID, userID }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;
    // const formdata = new FormData();
    // formdata.append("file", file);
    setFileImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Url = reader.result;
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

  const handleLoadHistoryMessage = async () => {
    if (messages?.data?.length > 0 && !isLoading) {
      const nextPage = prevPage + 1;
      const { MessageID } = messages?.data[0];
      setIsLoading(true);
      await axios
        .get(
          `${API__SERVER}/pairmessage/${userID}?other_userId=${id}&page=${nextPage}&limit=15`
        )
        .then((response) => response.data)
        .then((data) => {
          const dataMessage = data?.data;
          if (dataMessage) {
            if (Array.isArray(dataMessage) && dataMessage.length === 0) {
              setEndHistory(true);
            } else {
              return dispatch(handleGetHistoryMessage(dataMessage));
            }
          }
        })
        .then(() => {
          setIsLoading(false);
          const result = messRef.current.querySelector(
            `div[data-mgs="${MessageID}-${id}"]`
          );
          if (result) {
            result.scrollIntoView({ block: "end" });
            result.focus();
          }
          setPrevPage(nextPage);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  // console.log(dataSendMessage);

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
            <LazyLoad>
              <>
                <img
                  className="w-[66px] h-[66px] mobile:w-[50px] mobile:h-[50px] rounded-full object-cover"
                  src={`${avatar}`}
                  alt="avatar default"
                  onError={(e) => handleErrorImg(e.target)}
                />
              </>
            </LazyLoad>
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

        {/* <div className="flex gap-5">
          <div>
            <img
              className="w-[35px] h-[35px] object-cover mobile:w-[25px] mobile:h-[25px]"
              src={callVideo}
              alt="call video"
            />
          </div>

          <div>
            <img
              className="w-[35px] h-[35px] object-cover mobile:w-[25px] mobile:h-[25px]"
              src={callPhone}
              alt="call phone"
            />
          </div>
        </div> */}
      </div>

      <div
        className="flex-1 text-white p-[20px] overflow-hidden overflow-y-auto relative"
        ref={messRef}
      >
        {!endHistory && messages.data.length > 0 ? (
          <div
            className={`absolute top-0 ] ${
              isLoading ? "left-0 right-0 " : "right-0"
            }`}
          >
            {!isLoading ? (
              <div
                onClick={() => {
                  handleLoadHistoryMessage();
                }}
                className="mx-auto px-2 w-fit shadow-sm rounded-bl-lg shadow-black hover:text-bold text-black flex items-center cursor-pointer hover:font-bold bg-white"
              >
                <i>Xem thêm tin nhắn</i> <LuArrowBigUpDash />
              </div>
            ) : (
              <div className="loader mx-auto mt-1">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        {messages?.data?.length > 0
          ? messages?.data.map((data) => {
              if (data?.SenderID) {
                const {
                  SenderID,
                  MessageID,
                  Content,
                  MessageTime,
                  IsSeen,
                  Image,
                  imageLink: ImageBase64,
                } = data;
                SenderID === parseInt(id) &&
                  IsSeen === 0 &&
                  dispatch(postSeenMessage(MessageID));
                // console.log(index, messages.data.length);
                return (
                  <MessageDetailItem
                    key={`${MessageID}-${id}`}
                    data={{
                      SenderID,
                      OtherAvatar: messages?.info?.OtherAvatar,
                      MessageID,
                      Content,
                      MessageTime,
                      idParams: id,
                      IsSeen,
                      Image,
                      ImageBase64,
                      keyIndex: `${MessageID}-${id}`,
                      handleDeleteMessage,
                    }}
                  />
                );
              } else {
                return null;
              }
            })
          : ""}
      </div>

      <div>
        <form
          onSubmit={handleSubmitForm}
          className="relative flex flex-col justify-between mobile:p-3 ipad:p-2 tablet:p-3 p-5 m-3 border text-black mobile:rounded-[30px] rounded-[50px] border-solid border-[#4EC957]"
        >
          {imageUrl && (
            <div className="relative max-w-max">
              <LazyLoad>
                <>
                  <img
                    className="w-[50px] h-[50px] mobile:w-[30px] mobile:h-[30px] object-cover rounded duration-150"
                    src={`${imageUrl}`}
                    onError={(e) => (e.target.src = URL_BASE64 + imageUrl)}
                    alt="sendImage"
                  />
                </>
              </LazyLoad>

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
              ref={inputSendMessageRef}
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
                  onChange={(e) => {
                    handleImageChange(e);
                  }}
                  value={imageUrl ? "" : ""}
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
