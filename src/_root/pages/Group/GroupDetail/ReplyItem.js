import React from "react";

import Moment from "react-moment";
import { useDispatch } from "react-redux";

import {
  removeComment,
  likeUnlikeComment,
} from "../../../../service/redux/posts/postsSlice";

import { MdDelete } from "react-icons/md";
import { handleErrorImg } from "../../../../service/utils/utils";

import config from "../../../../configs/Configs.json";
import LazyLoad from "react-lazy-load";
const { URL_BASE64 } = config;

const ReplyItem = (props) => {
  const {
    FavoriteCount,
    CommentID,
    FullName,
    Content,
    CommentUpdateTime,
    IsFavorited,
    UserID,
    Avatar,
    PhotoURL,
  } = props.data;

  const dispatch = useDispatch();

  return (
    <li className="flex gap-2 items-start mb-4">
      <div>
        <LazyLoad>
          <img
            className="w-[42px] h-[42px] object-cover rounded-full"
            src={`${Avatar}`}
            alt="avatar"
            onError={(e) => handleErrorImg(e.target)}
          />
        </LazyLoad>
      </div>

      <div>
        <div className="flex gap-2 items-center group ">
          <div className="bg-[#423f3f] p-2 rounded-xl mobile:text-white">
            <h3 className="text-xs font-semibold capitalize">{FullName}</h3>
            <div>
              <p className="text-xs">{Content}</p>
            </div>
            {PhotoURL?.length > 0 && (
              <LazyLoad>
                <img
                  className="max-w-[250px] max-h-[150px] object-contain rounded mt-2"
                  src={`${PhotoURL[0]}`}
                  alt="comment-image"
                />
              </LazyLoad>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                dispatch(removeComment(CommentID));
              }}
              className="opacity-0 transition-all duration-100 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-700 btn-show-delete"
            >
              <MdDelete />
            </button>
          </div>
        </div>

        <div className="flex gap-3 text-[10px] mt-1">
          <Moment fromNow ago>{`${CommentUpdateTime}+0700`}</Moment>

          <div className="flex gap-1">
            <span>{FavoriteCount !== 0 && FavoriteCount}</span>
            <button
              type=""
              onClick={() =>
                dispatch(
                  likeUnlikeComment({ commentID: CommentID, userID: UserID })
                )
              }
              className={
                IsFavorited ? "text-primary" : "text-white mobile:text-black"
              }
            >
              Thích
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ReplyItem;
