import { Link } from "react-router-dom";
import Moment from "react-moment";

import { handleErrorImg } from "../../../../service/utils/utils";

import { Auth } from "../../../../service/utils/auth";

import config from "../../../../configs/Configs.json";
import LazyLoad from "react-lazy-load";
const { URL_BASE64 } = config;

const MessageHistoryItem = (props) => {
  const { userID } = new Auth();

  const {
    Content,
    OtherUsername,
    OtherAvatar,
    MessageTime,
    OtherUserID,
    idParams,
    isOnline,
    IsSeen,
    SenderID,
    isSeenMessage,
    Image,
  } = props.data;
  // console.log(props);
  return (
    <li
      style={
        parseInt(idParams) === OtherUserID
          ? { background: "rgba(0,0,0,.2)" }
          : {}
      }
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

              {Image && (
                <p
                  className={` text-lg tablet:text-sm mobile:text-xs ${
                    IsSeen === 1 ||
                    isSeenMessage ||
                    SenderID === parseInt(userID)
                      ? "text-gray-500"
                      : "text-white"
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
                    isSeenMessage ||
                    IsSeen === 1 ||
                    SenderID === parseInt(userID)
                      ? "text-gray-500"
                      : "text-white"
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
            {isOnline && (
              <span
                className={`w-[16px] h-[16px] mobile:w-[12px] mobile:h-[12px] rounded-full bg-[#FFA451]`}
              ></span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default MessageHistoryItem;
