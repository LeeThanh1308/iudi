import React from "react";
import { saveAs } from "file-saver";
import {
  MdDelete,
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdOutlineSaveAlt,
} from "react-icons/md";
import Moment from "react-moment";
import {
  handleDownloadFileUrl,
  handleErrorImg,
} from "../../../../service/utils/utils";
import LazyLoad from "react-lazy-load";
import config from "../../../../configs/Configs.json";
const { URL_BASE64 } = config;

const MessageDetailItem = (props) => {
  const [showFullImage, setShowFullImage] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState("");
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

  return showFullImage ? (
    <div className=" fixed top-0 right-0 left-0 bottom-0 bg-gray-900/95 z-50 flex justify-center">
      <div className="  absolute top-4 right-4 flex gap-2 text-white text-3xl justify-center items-center">
        <MdOutlineSaveAlt
          onClick={async () => {
            handleDownloadFileUrl(currentImage);
          }}
          className="hover:text-blue-500 cursor-pointer"
        />

        <MdOutlineFullscreenExit
          className="hover:text-blue-500 cursor-pointer"
          onClick={() => setShowFullImage((prev) => !prev)}
        />
      </div>
      <img
        src={currentImage}
        onLoad={(e) => console.log(e.target)}
        className="w-auto h-auto object-cover"
        alt="showImage"
      />
    </div>
  ) : SenderID !== parseInt(idParams) ? (
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
            <div className="flex items-center gap-1 group relative">
              <button
                type="button"
                className="text-black duration-200 opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteMessage(MessageID)}
              >
                <MdDelete />
              </button>

              <LazyLoad>
                <>
                  <img
                    className="max-w-[250px] max-h-[150px] object-contain rounded"
                    src={`${URL_BASE64 + ImageBase64}`}
                    onError={(e) => (e.target.src = ImageBase64)}
                    alt="sendImageBase64"
                  />
                </>
              </LazyLoad>

              <div
                className=" absolute top-0.5 right-0.5 cursor-pointer bg-black/10 text-black rounded-full p-0.5 hover:text-blue-500 bg-white filter-[blur(5px)]"
                onClick={(e) => {
                  console.log(e.target.closest("div"));
                  setShowFullImage(true);
                  setCurrentImage(ImageBase64);
                }}
              >
                <MdOutlineFullscreen className=" filter-none" />
              </div>
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
                <>
                  <img
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    src={`${OtherAvatar}`}
                    alt="avatar default"
                    onError={(e) => handleErrorImg(e.target)}
                  />
                </>
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
        <div className="pb-3 hehe">
          <div className="flex items-center justify-start gap-3 ">
            <div className="relative w-auto h-auto">
              <img
                className="w-[40px] h-[40px] rounded-full object-cover"
                src={`${OtherAvatar}`}
                alt="avatar default"
                onError={(e) => handleErrorImg(e.target)}
              />
            </div>

            <div className="flex items-center gap-1 group">
              <LazyLoad>
                <div className=" relative">
                  <img
                    className="max-w-[250px] max-h-[150px] object-contain rounded"
                    src={`${URL_BASE64 + ImageBase64}`}
                    onError={(e) => (e.target.src = ImageBase64)}
                    alt="sendImage"
                  />
                  <div
                    className=" absolute top-0.5 right-0.5 cursor-pointer bg-black/10 text-black rounded-full p-0.5 hover:text-blue-500"
                    onClick={(e) => {
                      console.log(e.target.closest("div"));
                      setShowFullImage(true);
                      setCurrentImage(ImageBase64);
                    }}
                  >
                    <MdOutlineFullscreen />
                  </div>
                </div>
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
