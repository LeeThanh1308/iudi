import React, { useEffect } from "react";
import logo from "./favicon.ico";
import { useSelector } from "react-redux";
import { messagesSelector } from "../../service/redux/messages/messagesSlice";

const FaviconNotification = () => {
  const { toTotalNoSendMessage } = useSelector(messagesSelector);
  useEffect(() => {
    const favicon = document.getElementById("favicon");
    const faviconUrl = favicon.getAttribute("href");
    const updateFavicon = (toTotalNoSendMessage) => {
      const img = document.createElement("img");
      img.src = faviconUrl;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const size = 32; // Kích thước của favicon

        canvas.width = size;
        canvas.height = size;

        // Vẽ favicon ban đầu
        context.drawImage(img, 0, 0, size, size);

        const radius = 11; // Bán kính hình tròn
        const xPos = size - radius; // Vị trí x (góc phải)
        const yPos = size - radius; // Vị trí y (góc dưới)

        // Tạo hình tròn màu đỏ ở góc phải bên dưới
        context.fillStyle = "red";
        context.beginPath();
        context.arc(xPos, yPos, radius, 0, 2 * Math.PI);
        context.fill();

        // Vẽ số thông báo ở giữa hình tròn
        context.font = "900 17px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(toTotalNoSendMessage, xPos, yPos);
        // Cập nhật favicon mới
        favicon.setAttribute("href", canvas.toDataURL("image/png"));
      };
    };
    if (toTotalNoSendMessage > 0) {
      updateFavicon(toTotalNoSendMessage);
    } else {
      favicon.setAttribute("href", logo);
    }
  }, [toTotalNoSendMessage]);
  return null;
};

export default FaviconNotification;
