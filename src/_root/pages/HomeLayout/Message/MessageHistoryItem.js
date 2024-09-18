import { Link } from "react-router-dom";
import Moment from "react-moment";

import { handleErrorImg } from "../../../../service/utils/utils";

import { Auth } from "../../../../service/utils/auth";

import config from "../../../../configs/Configs.json";
import LazyLoad from "react-lazy-load";
import { useDispatch } from "react-redux";
import {
  fetchHistoryMessages,
  postSeenMessage,
} from "../../../../service/redux/messages/messagesSlice";
import { useEffect, useState } from "react";
import axios from "axios";
const { URL_BASE64, API__SERVER } = config;

const MessageHistoryItem = (props) => {
  const { userID } = new Auth();
  const [totalNoSendMgs, setTotalNoSendMgs] = useState(0);
  const dispatch = useDispatch();
  const {
    Content,
    OtherUsername,
    OtherAvatar,
    MessageTime,
    MessageID,
    OtherUserID,
    idParams,
    isOnline,
    IsSeen,
    SenderID,
    isSeenMessage,
    Image,
  } = props.data;
  console.log(props);
  // console.table({ Content, isSeenMessage, IsSeen, SenderID, userID });
  useEffect(() => {
    if (!IsSeen?.readed) {
      axios
        .get(
          `${API__SERVER}/pairmessage/${userID}?other_userId=${OtherUserID}&page=${1}&limit=${10}`
        )
        .then((response) => response.data)
        .then((data) => {
          if (Array.isArray(data?.data) && data?.data?.length > 0) {
            const total = data.data.reduce((acc, item) => {
              return !item.IsSeen && item?.ReceiverID === item?.UserID
                ? (acc += 1)
                : (acc += 0);
            }, 0);

            setTotalNoSendMgs(total);
          }
        });
    }
  }, []);
  return (
    <li
      style={
        parseInt(idParams) === OtherUserID
          ? { background: "rgba(0,0,0,.2)" }
          : {}
      }
      onClick={async () => {
        await dispatch(postSeenMessage(MessageID));
        await dispatch(fetchHistoryMessages(userID));
        setTotalNoSendMgs(0);
      }}
    >
      <Link
        to={`/message/${OtherUserID}`}
        state={{
          userName: OtherUsername,
          isOnline,
          avatar: OtherAvatar,
        }}
      >
        <div className="flex items-center justify-between mt-4 cursor-pointer">
          <div className="flex items-center gap-2">
            <img
              className=" mx-auto w-[73px] h-[73px] tablet:w-[60px] tablet:h-[60px] mobile:w-[50px] mobile:h-[50px] rounded-full object-cover"
              src={`${OtherAvatar}`}
              alt={`avatar ${OtherUsername}`}
              onError={(e) => handleErrorImg(e.target)}
            />
            <div>
              <h3 className="capitalize text-xl tablet:text-lg mobile:text-sm font-medium">
                {OtherUsername}
              </h3>

              {!Image && !Content && (
                <p
                  className={` text-lg tablet:text-sm mobile:text-xs ${
                    SenderID !== parseInt(userID) && !IsSeen?.readed
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {SenderID === parseInt(userID)
                    ? "You send a photo"
                    : "You receive  a photo"}
                </p>
              )}

              {Image && (
                <p
                  className={` text-lg tablet:text-sm mobile:text-xs ${
                    SenderID !== parseInt(userID) && !IsSeen?.readed
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {SenderID === parseInt(userID)
                    ? "You send a photo"
                    : "You receive  a photo"}
                </p>
              )}

              {!Image && Content && (
                <p
                  className={`message-item-text text-lg tablet:text-sm mobile:text-xs ${
                    SenderID !== parseInt(userID) && !IsSeen?.readed
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {Content}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <Moment
              className="mobile:text-sm"
              date={`${MessageTime}+0700`}
              format="hh:mm A"
            />

            <span
              className={`w-[16px] flex text-xs font-bold justify-center items-center h-[16px] mobile:w-[12px] mobile:h-[12px] rounded-full ${
                !isOnline || "bg-green"
              }`}
            >
              {totalNoSendMgs > 0 ? totalNoSendMgs : ""}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default MessageHistoryItem;
