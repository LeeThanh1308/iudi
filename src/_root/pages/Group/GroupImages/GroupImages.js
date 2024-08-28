import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { useSelector } from "react-redux";
import { postsSelector } from "../../../../service/redux/posts/postsSlice";

import { handleErrorImgPost } from "../../../../service/utils/utils";

import config from "../../../../configs/Configs.json";
const { URL_BASE64 } = config;

const GroupImages = () => {
  const postsState = useSelector(postsSelector);
  const [showAllImages, setShowAllImages] = useState(false);

  const imageList = [];

  postsState?.posts?.map(({ Photo }) => {
    return Photo.map((image) => imageList.push(image));
  });

  const imageList2 = showAllImages ? imageList : imageList.slice(0, 8);

  console.table({ showAllImages, imageList, postsState });
  return (
    <div>
      {imageList.length > 0 ? (
        <div className="p-3 bg-[#18191a] rounded-md mx-auto">
          <div className="bg-[#242526] rounded p-2">
            <div className="flex justify-between mb-2">
              <h5>Ảnh</h5>

              <div>
                {imageList.length > 8 && (
                  <button
                    className="text-blue-600"
                    type="button"
                    onClick={() => setShowAllImages(!showAllImages)}
                  >
                    {showAllImages ? (
                      <span>Ẩn bớt</span>
                    ) : (
                      <span>Xem tất cả ảnh</span>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="">
              <ul className="flex flex-wrap laptop:grid laptop:grid-cols-3">
                {imageList2.map((image) => {
                  return (
                    <li key={uuidv4()} className="p-1">
                      <img
                        className="h-[150px] w-[150px] ipad:h-[70px] ipad:w-[70px] object-cover rounded"
                        src={`${URL_BASE64}${image}`}
                        alt="image"
                        onError={(e) => handleErrorImgPost(e.target)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default GroupImages;
