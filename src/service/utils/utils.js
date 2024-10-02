import slugify from "react-slugify";
import AVATAR_DEFAULT from "../../images/avatar-default.jpg";
import config from "../../configs/Configs.json";
import webNotification from "simple-web-notification";
import ImageGroupIcon from "./../../images/thread.png";
// import icon from "./favicon.ico";
import { useState } from "react";
import { toast } from "react-toastify";

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

export const handleDownloadFileUrl = async (fileUrl) => {
  try {
    // Fetch file từ URL
    const response = await fetch(fileUrl.replace("http", "https"));

    // Kiểm tra phản hồi có hợp lệ không
    if (!response.ok) {
      throw new Error("Failed to fetch file.");
    }

    // Chuyển đổi response thành Blob
    const blob = await response.blob();

    // Tạo URL cho file Blob
    const url = window.URL.createObjectURL(blob);

    // Tạo thẻ <a> để download file
    const a = document.createElement("a");
    a.href = url;
    a.download = fileUrl.split("/").pop(); // Tên file khi tải về (bạn có thể đổi tên file)

    // Tự động click để tải file
    a.click();

    // Giải phóng bộ nhớ sau khi tải
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("Error downloading the file:", error);
    console.log(error);
  }
};

export const handleErrorPostImgGroup = (event) => (event.src = ImageGroupIcon);

export const handleFormatNumber = (num = 0) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};
