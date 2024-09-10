import React, { useRef, useState } from "react";
import CommentItem from "./CommentItem";
import { FaChevronDown } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { RiAttachment2 } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

const Comments = ({ comments }) => {
  const { comentList, commentRef, inputCommentRef, onSubmitComment } = comments;
  const refUlElement = useRef();
  const refIcondown = useRef();
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleEmojiClick = (data) => {
    inputCommentRef.current.value += data.emoji;
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

  // console.log(comentList);

  return (
    <div id="comment-list" className="hidden duration-200" ref={commentRef}>
      {comentList?.length > 0 ? (
        <div>
          <div>
            <button
              className="flex gap-2 items-center my-3"
              type=""
              // onClick={() => {
              //   const isHidden =
              //     refUlElement.current.classList.contains("hidden");
              //   if (isHidden) {
              //     refUlElement.current.classList.remove("hidden");
              //     refIcondown.current.style.transform = "rotate(0)";
              //   } else {
              //     refUlElement.current.classList.add("hidden");
              //     refIcondown.current.style.transform = "rotate(180deg)";
              //   }
              // }}
            >
              <p>Bình luận liên quan nhất</p>
              <div ref={refIcondown}>
                <FaChevronDown />
              </div>
            </button>
          </div>

          <ul ref={refUlElement} className="transition-all duration-200">
            {comentList.map(
              ({
                FavoriteCount,
                CommentID,
                FullName,
                Content,
                PhotoURL,
                CommentUpdateTime,
                IsFavorited,
                UserID,
                PostID,
                Avatar,
                ReplyID,
              }) => {
                const imgRef = React.createRef();
                return (
                  <CommentItem
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
                      PostID,
                      Avatar,
                      imgRef,
                      ReplyID,
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
            onSubmitComment(e, imageFile);
            setImageUrl(null);
            setImageFile(null);
          }}
          className="flex mobile:border-[#deb887] items-center justify-center p-5 border bg-white text-black h-[60px] rounded-[20px] mt-5"
        >
          {imageUrl && (
            <div className="relative max-w-max">
              <button
                className="absolute right-[-10px] top-[-10px] mobile:right-[-5px] mobile:top-[-5px] text-xl mobile:text-sm"
                onClick={() => {
                  setImageUrl((prev) => (prev = null));
                  setImageFile((prev) => (prev = null));
                }}
              >
                <IoIosCloseCircle />
              </button>
            </div>
          )}

          <input
            className="w-full mr-5 focus-visible:outline-none bg-transparent"
            type="text"
            placeholder="Viết bình luận..."
            ref={inputCommentRef}
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
                <div className="absolute bottom-[100%] mobile:right-[-50px] right-0 text-[18px]">
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[24px]">
                <RiAttachment2 />
              </div>
            </div>

            <button type="submit" className="text-[30px]">
              <IoMdSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments;
