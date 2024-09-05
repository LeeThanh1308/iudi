import React from "react";

import { MdDelete } from "react-icons/md";
import Moment from "react-moment";
import { handleErrorImg } from "../../../../service/utils/utils";
import LazyLoad from "react-lazy-load";
import config from "../../../../configs/Configs.json";
const { URL_BASE64 } = config;

const MessageDetailItem = (props) => {
  const {
    SenderID,
    OtherAvatar,
    MessageID,
    Content,
    MessageTime,
    idParams,
    keyIndex,
    handleDeleteMessage,
    Image,
    ImageBase64,
  } = props.data;

  return SenderID !== parseInt(idParams) ? (
    <div className="flex justify-end" data-mgs={keyIndex}>
      <div className="flex flex-col items-end">
        {Content !== "" && Content !== null && (
          <div className="pb-3">
            <div className="flex items-center gap-1 group">
              <button
                type="button"
                className="text-black duration-200 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteMessage(MessageID)}
              >
                <MdDelete />
              </button>

              <p className="bg-blue-600 rounded-[8px] p-[10px]">{Content}</p>
            </div>

            <Moment
              date={`${MessageTime}+0700`}
              format="hh:mm A"
              className="text-xs text-gray-500 flex justify-end"
            />
          </div>
        )}

        {ImageBase64 && (
          <div className="pb-3">
            <div className="flex items-center gap-1 group">
              <button
                type="button"
                className="text-black duration-200 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteMessage(MessageID)}
              >
                <MdDelete />
              </button>

              <LazyLoad>
                <img
                  className="max-w-[250px] max-h-[150px] object-contain rounded"
                  src={`${URL_BASE64 + ImageBase64}`}
                  onError={(e) => (e.target.src = ImageBase64)}
                  alt="sendImageBase64"
                />
              </LazyLoad>
            </div>

            <Moment
              date={`${MessageTime}+0700`}
              format="hh:mm A"
              className="text-xs text-gray-500 flex justify-end"
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <>
      {Content !== "" && Content !== null && (
        <div className="pb-3" data-mgs={keyIndex}>
          <div className="flex items-center justify-start gap-3 ">
            <div className="w-[40px] h-[40px]">
              <LazyLoad className="w-[40px] h-[40px]">
                <img
                  className="w-[40px] h-[40px] rounded-full object-cover"
                  src={`${OtherAvatar}`}
                  alt="avatar default"
                  onError={(e) => handleErrorImg(e.target)}
                />
              </LazyLoad>
            </div>

            <div className="flex items-center gap-1 group">
              <p className="bg-black rounded-[8px] p-[10px]">{Content}</p>

              <button
                type="button"
                className="text-black duration-200 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteMessage(MessageID)}
              >
                <MdDelete />
              </button>
            </div>
          </div>
          <Moment
            date={`${MessageTime}+0700`}
            format="hh:mm A"
            className="text-xs text-gray-500"
          />
        </div>
      )}

      {ImageBase64 && (
        <div className="pb-3">
          <div className="flex items-center justify-start gap-3 ">
            <div>
              <LazyLoad>
                <img
                  className="w-[40px] h-[40px] rounded-full object-cover"
                  src={`${OtherAvatar}`}
                  alt="avatar default"
                  onError={(e) => handleErrorImg(e.target)}
                />
              </LazyLoad>
            </div>

            <div className="flex items-center gap-1 group">
              <LazyLoad>
                <img
                  className="max-w-[250px] max-h-[150px] object-contain rounded"
                  src={`${URL_BASE64 + ImageBase64}`}
                  onError={(e) => (e.target.src = ImageBase64)}
                  alt="sendImage"
                />
              </LazyLoad>
              <button
                type="button"
                className="text-black duration-200 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteMessage(MessageID)}
              >
                <MdDelete />
              </button>
            </div>
          </div>
          <Moment
            date={`${MessageTime}+0700`}
            format="hh:mm A"
            className="text-xs text-gray-500"
          />
        </div>
      )}
    </>
  );
};

export default MessageDetailItem;
