import slugify from "react-slugify";
import AVATAR_DEFAULT from "../../images/avatar-default.jpg";
import config from "../../configs/Configs.json";
import webNotification from "simple-web-notification";
// import icon from "./favicon.ico";
import { useState } from "react";

const {
  IMAGE_POST_PLACEHOLDER,
  IMAGE_PROFILE_PLACEHOLDER,
  IMAGE_GROUP_PLACEHOLDER,
  IMAGE_SLIDE_GROUP_PLACEHOLDER,
} = config;

export const slugString = (string) => slugify(string);

export const handleErrorImg = (element) => {
  element.src = `${AVATAR_DEFAULT}`;
};

export const handleErrorImgPost = (element) => {
  element.src = `${IMAGE_POST_PLACEHOLDER}`;
};

export const handleErrorImgProfile = (element) => {
  element.src = `${IMAGE_PROFILE_PLACEHOLDER}`;
};

export const handleErrorImgGroup = (element) => {
  element.src = `${IMAGE_GROUP_PLACEHOLDER}`;
};

export const handleErrorImgSlideGroup = (element) => {
  element.src = `${IMAGE_SLIDE_GROUP_PLACEHOLDER}`;
};

export const HandleHiddenText = ({ text = "", length }) => {
  const [showText, setShowText] = useState(false);
  return (
    <>
      {text.length > length && !showText ? (
        <>
          {`${text.slice(0, length)}...`}
          <span
            className="font-bold cursor-pointer"
            onClick={() => setShowText(true)}
          >
            Xem thêm
          </span>
        </>
      ) : (
        text
      )}
    </>
  );
};

export const handleSendToastify = (message) => {
  console.log("Show toastify");
  webNotification.showNotification(
    "Iudi",
    {
      body: `${message ?? "Bạn vừa nhận được một tinh nhắn"}`,
      icon: "favicon.ico",
      onClick: function onNotificationClicked() {
        window.open(window.location.origin, "_blank");
      },
      // autoClose: 4000, //auto close the notification after 4 seconds (you can manually close it via hide function)
    },
    function onShow(error, hide) {
      if (error) {
        // window.alert("Unable to show notification: " + error.message);
      } else {
        console.log("Notification Shown.");

        setTimeout(function hideNotification() {
          console.log("Hiding notification....");
          //manually close the notification (you can skip this if you use the autoClose option)
        }, 5000);
      }
    }
  );
};
