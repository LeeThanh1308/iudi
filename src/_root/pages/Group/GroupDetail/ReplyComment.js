import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { RiAttachment2 } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { postComment } from "../../../../service/redux/posts/postsSlice";
import { useDispatch } from "react-redux";
import { Auth } from "../../../../service/utils/auth";
import ReplyItem from "./ReplyItem";

const ReplyComment = ({ CommentID, PostID, ReplyList }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [value, setValue] = useState("");
  const [imageFile, setImageFile] = useState("");

  const { userID } = new Auth();

  const dispatch = useDispatch();

  const handleEmojiClick = (data) => {
    setValue((value) => value + data.emoji);
    setShowEmoji(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Url = reader.result.split(",")[1];
      if (base64Url !== imageUrl) {
        setImageFile(file);
        setImageUrl(base64Url);
      }
    };
  };

  const handleReplyComment = (e, imageUrl) => {
    e.preventDefault();
    if (value.trim() === "" && imageUrl === null) return;

    const data = {
      Content: value,
      PhotoURL: imageFile,
      ReplyID: CommentID,
    };
    dispatch(postComment({ PostID, data, userID }));
    setValue("");
    setImageUrl(null);
    setImageUrl(null);
  };

  return (
    <div className="duration-200">
      {ReplyList?.length > 0 ? (
        <div>
          <ul className="transition-all duration-200 mt-3">
            {ReplyList.map(
              ({
                FavoriteCount,
                CommentID,
                FullName,
                Content,
                PhotoURL,
                CommentUpdateTime,
                IsFavorited,
                UserID,
                Avatar,
              }) => {
                return (
                  <ReplyItem
                    key={CommentID}
                    data={{
                      FavoriteCount,
                      CommentID,
                      FullName,
                      Content,
                      PhotoURL,
                      CommentUpdateTime,
                      IsFavorited,
                      UserID,
                      Avatar,
                    }}
                  />
                );
              }
            )}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div>
        <form
          onSubmit={(e) => {
            handleReplyComment(e, imageUrl);
            setImageUrl(null);
          }}
          className="flex mobile:border-[#deb887] items-center justify-center p-5 border bg-white text-black h-[56px] rounded-[20px] mt-5"
        >
          {imageUrl && (
            <div className="relative max-w-max">
              <img
                className="w-[40px] h-[40px] mobile:w-[20px] mobile:h-[20px] object-cover rounded duration-150"
                src={`data:image/jpeg;base64,${imageUrl}`}
                alt="sendImage"
              />
              <button
                className="absolute right-[-10px] top-[-10px] mobile:right-[-5px] mobile:top-[-5px] text-xl mobile:text-sm"
                onClick={() => setImageUrl(null)}
              >
                <IoIosCloseCircle />
              </button>
            </div>
          )}

          <input
            className="w-full mr-5 focus-visible:outline-none text-[15px] bg-transparent"
            type="text"
            placeholder="Phản hồi..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="relative">
              <button
                type="button"
                className="flex"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <MdEmojiEmotions className="size-7" />
              </button>

              {showEmoji && (
                <div className="absolute bottom-[100%] mobile:right-[-50px] right-0 text-[15px]">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            <div className="relative">
              <input
                onChange={handleImageChange}
                type="file"
                className="w-[32px] mobile:w-[20px] opacity-0 z-10 relative"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22px]">
                <RiAttachment2 />
              </div>
            </div>

            <button type="submit" className="text-[28px]">
              <IoMdSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyComment;
