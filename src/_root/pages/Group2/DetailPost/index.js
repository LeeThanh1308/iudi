import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaHeart, FaRegFileImage } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { AiTwotoneLike } from "react-icons/ai";
import { GrSend } from "react-icons/gr";
import { RiReplyLine } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import {
  addLikePost,
  fetchDetailPost,
  likeUnlikeComment,
  postComment,
  postsSelector,
  removeComment,
} from "../../../../service/redux/posts/postsSlice";
import Moment from "react-moment";
import {
  handleErrorImg,
  handleFormatNumber,
  HandleHiddenText,
} from "../../../../service/utils/utils";
import { Auth } from "../../../../service/utils/auth";
import config from "../../../../configs/Configs.json";
import axios from "axios";
import { toast } from "react-toastify";
import PopupForm from "../../../../components/PopupForm";
import Comments from "../../Group/GroupDetail/Comments";
import { data } from "autoprefixer";
const { API__SERVER } = config;

function DetailPost() {
  const { slug, threadID, groupId } = useParams();
  const [isFavorited, setIsFavorited] = useState(
    JSON?.parse(
      window.localStorage.getItem("IsLiked")
        ? window.localStorage.getItem("IsLiked")
        : "{}"
    )?.isLike ?? false
  );
  const { userID } = new Auth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [listComment, setListComment] = useState([]);
  const [imageBase64s, setImageBase64s] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isShowFormComment, setIsShowFormComment] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [dataThisComment, setDataThisComment] = useState({
    Comment: "",
    PhotoURL: "",
  });

  const handleEmojiClick = (data) => {
    const CommentID = window.localStorage.getItem("ThisCommentID");
    if (CommentID) {
      setDataThisComment((prev) => ({
        ...prev,
        [CommentID]: {
          ...prev[CommentID],
          Content: prev[CommentID].Content + data.emoji,
        },
      }));
      setShowEmoji(false);
    }
  };

  const { post, changeTogglePost } = useSelector(postsSelector);
  const dispatch = useDispatch();
  const handleSetIsLike = (isLike, PostID) => {
    window.localStorage.setItem(
      "IsLiked",
      JSON.stringify({
        id: PostID,
        isLike: isLike,
      })
    );
  };

  const handleSubmitFormPost = () => {
    const { Comment } = dataThisComment;
    if (!Comment) {
      setDataThisComment((prev) => ({
        ...prev,
        warnComment: !Comment ? "Trường này không được để trống!" : "",
      }));
    } else {
      const formData = new FormData();
      formData.append("Content", Comment);
      imageFiles.forEach((file) => formData.append("PhotoURL", file));
      dispatch(
        postComment({ PostID: dataThisComment?.PostID, data: formData, userID })
      );
    }
  };

  const handlePushImage = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Url = reader.result;
      setImageBase64s((prev) => [...prev, base64Url]);
      setImageFiles((prev) => [...prev, file]);
    };
  };

  const handleSubmitSendSubComment = async (commentID) => {
    if (commentID) {
      if (dataThisComment[commentID]?.Content) {
        const formData = new FormData();
        formData.append("Content", dataThisComment[commentID]?.Content);
        formData.append("PhotoURL", dataThisComment[commentID]?.PhotoURL);
        formData.append("ReplyID", commentID);
        await dispatch(
          postComment({ PostID: threadID, data: formData, userID })
        );
        setDataThisComment((prev) => ({
          ...prev,
          [commentID]: {
            ...prev[commentID],
            Content: "",
            PhotoURL: "",
            base64Url: "",
          },
        }));
      }
    }
  };

  const handlePushSubCommentImage = async (e, CommentID) => {
    let file = e?.target?.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Url = reader.result;
      setDataThisComment((prev) => ({
        ...prev,
        [CommentID]: {
          ...prev[CommentID],
          base64Url,
          PhotoURL: file,
        },
      }));
    };
  };
  const handleDeleteListImage = async (index) => {
    const newImageBase64s = [...imageBase64s];
    const newImageFiles = [...imageFiles];
    // Xóa phần tử tại vị trí index
    newImageBase64s.splice(index, 1);
    newImageFiles.splice(index, 1);
    // Cập nhật lại state với mảng mới
    setImageBase64s(newImageBase64s);
    setImageFiles(newImageFiles);
  };

  const handleDeleteImageSubImage = (CommentID) => {
    setDataThisComment((prev) => ({
      ...prev,
      [CommentID]: {
        ...prev[CommentID],
        base64Url: "",
        PhotoURL: "",
      },
    }));
  };

  useEffect(() => {
    (async (PostID, UserID, groupId) => {
      await dispatch(fetchDetailPost({ groupId, postId: threadID }));
      const { data } = await axios
        .get(`${API__SERVER}/forum/comment/${PostID}/${UserID}?page=${page}`)
        .catch(() => toast.error("Get list of comments failed!"));
      if (Array.isArray(data?.Comments) && data?.Comments.length > 0) {
        setListComment(data?.Comments);
        setLimit(data?.total_page);
      }
    })(threadID, userID, groupId);
    setIsShowFormComment(false);
  }, [threadID, groupId, changeTogglePost]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isShowFormComment) {
      setImageBase64s([]);
      setImageFiles([]);
    }
  }, [isShowFormComment]);
  // console.log(dataThisComment);
  // console.log(
  //   listComment.map((item, i) => {
  //     return {
  //       ...item.ReplyID.map((reply) => ({
  //         ...item,
  //         ...reply,
  //         EDIT: "OKELA",
  //       })),
  //     };
  //   })
  // );
  return (
    <div className="w-full h-full p-8 backdrop:blur-md bg-black/50 text-white mt-4 relative">
      <div className="w-full flex justify-between items-center">
        <div className="mt-3 py-2 rounded-xl">
          <Pagination
            colorText="#fff"
            total={Number(20)}
            pageSize={10}
            current={Number(1)}
            showLessItems={false}
            showQuickJumper={false}
            showSizeChanger={false}
            align="start"
            className=" text-white custom-pagination"
          />
        </div>
        <div className="">
          <Link to={`/group/${slug}/${groupId}`}>
            <button className=" px-1 py-2 rounded-lg shadow-sm shadow-white">
              Tới bài mới nhất
            </button>
          </Link>
        </div>
      </div>

      {/* Bài viết chính */}
      <div className="w-full">
        {Array.isArray(post) &&
          post.length > 0 &&
          post.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <div key={i} className=" rounded-md overflow-hidden">
                  <div className="w-full py-2 px-1 backdrop:blur-md flex bg-white justify-between text-black">
                    <Moment
                      locale="VN"
                      format="hh:mm DD/MM/YYYY"
                      fromNow
                    >{`${item?.UpdatePostAt}+0700`}</Moment>
                    <h3>#Chủ thớt</h3>
                  </div>
                  <div className="border-x border-b border-solid border-white rounded-b-md overflow-hidden">
                    <Link to={`/profile/${item?.UserName}`}>
                      <div className="w-full border-b border-solid border-white p-4">
                        <div className="w-full h-auto flex justify-start items-center">
                          <img
                            src={item?.Avatar}
                            alt="avatar"
                            className=" w-1/12  aspect-square rounded-full mr-3 object-cover"
                            onError={handleErrorImg}
                          />
                          <div>
                            <h1 className=" text-xl font-bold w-full">
                              {item?.UserFullName}
                            </h1>
                            <h1 className=" text-lg font-semibold w-full">
                              <Moment
                                fromNow
                                ago
                                date={`${item?.UpdatePostAt}+0700`}
                              />
                            </h1>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4 relative">
                      <h1 className=" text-lg font-semibold mb-4">
                        {item?.Title}
                      </h1>
                      <p>
                        <HandleHiddenText text={item?.Content} length={100} />
                      </p>

                      {Array.isArray(item?.listphoto) &&
                        item?.listphoto.length > 0 &&
                        item?.listphoto.map((item, i) => {
                          return (
                            <div
                              key={i}
                              className="w-full h-[70vh] backdrop:blur-md bg-black/80 rounded-lg"
                            >
                              <img
                                src={item?.photo_link}
                                alt="post"
                                className="h-full mx-auto object-contain"
                                onError={handleErrorImg}
                              />
                            </div>
                          );
                        })}

                      <div className=" w-full pt-3 flex gap-2 justify-between items-center">
                        <div className="  pt-3 flex gap-2 items-center text-2xl">
                          {!item?.IsFavorited ? (
                            <FaRegHeart
                              className="text-white cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                  addLikePost({ postId: item?.PostID, userID })
                                );
                                handleSetIsLike(true, item?.PostID);
                                setIsFavorited(true);
                              }}
                            />
                          ) : (
                            <FaHeart
                              className="text-red-500 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                  addLikePost({ postId: item?.PostID, userID })
                                );
                                handleSetIsLike(false, item?.PostID);
                                setIsFavorited(false);
                              }}
                            />
                          )}
                          {handleFormatNumber(item?.FavoriteCount)}
                        </div>

                        <div
                          className="p-2 flex gap-1 text-sm font-medium items-center cursor-pointer"
                          onClick={() => {
                            setDataThisComment(item);
                            setIsShowFormComment(true);
                          }}
                        >
                          <RiReplyLine />
                          <p>Trả lời</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
      {/* List Comments */}
      {Array.isArray(listComment) &&
        listComment?.length > 0 &&
        listComment.map((dataComment, i) => {
          return (
            <div key={i} className="mt-2 rounded-md h-auto">
              <div className="w-full py-2 px-1 backdrop:blur-md flex bg-white justify-between text-black">
                <Moment
                  locale="VN"
                  format="hh:mm DD/MM/YYYY"
                  fromNow
                >{`${dataComment?.CommentUpdateTime}+0700`}</Moment>
                <h3>#Comment {i + 1}</h3>
              </div>
              <div className="border-x border-b border-solid border-white  rounded-b-md overflow-hidden">
                <div className="w-full border-b border-solid border-white p-4">
                  <div className="w-full flex justify-between items-center">
                    <Link to={`/profile/${dataComment?.UserName}`}>
                      <div className=" flex justify-start items-center">
                        <img
                          src={dataComment?.Avatar}
                          alt="avatar"
                          className=" w-16 h-16 aspect-square  rounded-full mr-3 object-cover"
                          onError={handleErrorImg}
                        />
                        <div className="w-full">
                          <h1 className=" text-sm font-medium">
                            {dataComment?.FullName}
                          </h1>
                          <h1 className=" text-lg font-semibold w-full">
                            <Moment
                              fromNow
                              ago
                              date={`${dataComment?.CommentUpdateTime}+0700`}
                            />
                          </h1>
                        </div>
                      </div>{" "}
                    </Link>
                    <div>
                      {dataComment?.UserID === userID && (
                        <button
                          className={`hover:text-red-500`}
                          onClick={() => {
                            const IsExist = window.confirm(
                              "Bạn chắc chắn muốn xóa comment này?"
                            );
                            if (IsExist) {
                              dispatch(removeComment(dataComment?.CommentID));
                            }
                          }}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p>
                    <HandleHiddenText
                      text={dataComment?.Content}
                      length={100}
                    />
                  </p>

                  {Array.isArray(dataComment?.PhotoURL) &&
                    dataComment?.PhotoURL.length > 0 &&
                    dataComment?.PhotoURL.map((dataComment, i) => {
                      return (
                        <div
                          key={i}
                          className="w-full aspect-video backdrop:blur-md bg-black/80 rounded-lg"
                        >
                          <img
                            src={dataComment}
                            alt="post"
                            className="w-full h-full object-contain rounded-lg"
                            onError={handleErrorImg}
                          />
                        </div>
                      );
                    })}

                  <div className="pt-3  flex justify-between items-center">
                    <div className="flex gap-2 items-center text-md">
                      {!dataComment?.IsFavorited ? (
                        <FaRegHeart
                          className="text-white cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(
                              likeUnlikeComment({
                                commentID: dataComment?.CommentID,
                                userID,
                              })
                            );
                          }}
                        />
                      ) : (
                        <FaHeart
                          className="text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(
                              likeUnlikeComment({
                                commentID: dataComment?.CommentID,
                                userID,
                              })
                            );
                          }}
                        />
                      )}
                      {handleFormatNumber(dataComment?.FavoriteCount)}
                    </div>
                    <div
                      onClick={() => {
                        setDataThisComment((prev) => ({
                          ...prev,
                          [dataComment?.CommentID]: {
                            ...prev[dataComment?.CommentID],
                            isShowID: dataComment?.CommentID,
                          },
                        }));
                      }}
                      className="text-sm font-medium hover:underline cursor-pointer hover:text-blue-500"
                    >
                      {Array.isArray(dataComment?.ReplyID) &&
                      dataComment?.ReplyID.length > 0
                        ? handleFormatNumber(dataComment?.ReplyID?.length)
                        : 0}{" "}
                      comments
                    </div>
                  </div>
                </div>
                {dataThisComment[dataComment?.CommentID]?.isShowID ===
                  dataComment?.CommentID && (
                  <>
                    {/*List comments  */}
                    <div className=" border-t border-white p-4">
                      <div>
                        {Array.isArray(dataComment?.ReplyID) &&
                          dataComment?.ReplyID.length > 0 &&
                          dataComment?.ReplyID.map((itemReply, i) => {
                            return (
                              <div>
                                <div className="mt-4 flex items-center mb-1">
                                  <div
                                    className="w-10 aspect-square mr-2"
                                    key={i}
                                  >
                                    <img
                                      src={itemReply?.Avatar}
                                      alt="avatar"
                                      className="w-full h-full rounded-full"
                                      onError={handleErrorImg}
                                    />
                                  </div>
                                  <div className="flex items-start justify-center flex-col px-3 pr-14 py-2 bg-[#222222] rounded-lg">
                                    <h3 className="text-sm font-medium">
                                      {itemReply?.FullName}
                                    </h3>
                                    <p>{itemReply?.Content}</p>
                                  </div>
                                </div>
                                <div className=" text-xs flex gap-3 items-center ">
                                  <Moment
                                    fromNow
                                    ago
                                    date={`${itemReply?.CommentUpdateTime}+0700`}
                                  />
                                  <p
                                    className={`${
                                      itemReply?.IsFavorited && "text-blue-500"
                                    } hover:text-blue-500 cursor-pointer${
                                      itemReply?.IsFavorited
                                        ? "text-blue-500"
                                        : "text-white"
                                    }`}
                                    onClick={() =>
                                      dispatch(
                                        likeUnlikeComment({
                                          commentID: itemReply?.CommentID,
                                          userID,
                                        })
                                      )
                                    }
                                  >
                                    {itemReply?.FavoriteCount
                                      ? itemReply?.FavoriteCount
                                      : ""}{" "}
                                    {itemReply?.IsFavorited
                                      ? "Đã Thích"
                                      : "Thích"}
                                  </p>
                                  {itemReply?.UserID === userID && (
                                    <button
                                      className={`hover:text-red-500`}
                                      onClick={() => {
                                        const IsExist = window.confirm(
                                          "Bạn chắc chắn muốn xóa comment này?"
                                        );
                                        if (IsExist) {
                                          dispatch(
                                            removeComment(itemReply?.CommentID)
                                          );
                                        }
                                      }}
                                    >
                                      Xóa
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div
                      className="p-4 "
                      onClick={() =>
                        window.localStorage.setItem(
                          "ThisCommentID",
                          dataComment?.CommentID
                        )
                      }
                    >
                      <div className="w-full flex relative">
                        <input
                          type="text"
                          className="rounded-l-full w-full py-2 px-4 flex-[6] bg-white text-black outline-none"
                          placeholder="Bình luận bài viết..."
                          value={
                            dataThisComment[dataComment?.CommentID]?.Content
                          }
                          onChange={(e) => {
                            setDataThisComment((prev) => ({
                              ...prev,
                              [dataComment?.CommentID]: {
                                ...prev[dataComment?.CommentID],
                                Content: e.target.value,
                              },
                            }));
                          }}
                        />
                        <div className="flex-[1] flex z-50">
                          <div className="relative h-full bg-white text-blue-500 hover:text-white hover:bg-blue-500 flex-1 aspect-square flex items-center justify-center">
                            <button
                              type="button"
                              className="flex"
                              onClick={() => setShowEmoji(!showEmoji)}
                            >
                              <MdEmojiEmotions className="size-7" />
                            </button>

                            {showEmoji && (
                              <div
                                className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-50"
                                onClick={() => setShowEmoji(false)}
                              >
                                <EmojiPicker
                                  onClick={(e) => e.preventDefault()}
                                  onEmojiClick={(data) => {
                                    handleEmojiClick(data);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          {!dataThisComment[dataComment?.CommentID]
                            ?.PhotoURL ? (
                            <button className="flex-1 h-full aspect-square text-blue-500 bg-white my-auto text-xl hover:bg-blue-500 hover:text-white flex items-center justify-center relative">
                              <input
                                type="file"
                                className="absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer"
                                onChange={(e) =>
                                  handlePushSubCommentImage(
                                    e,
                                    dataComment?.CommentID
                                  )
                                }
                                value={
                                  dataThisComment[dataComment?.CommentID]
                                    ?.PhotoURL
                                    ? ""
                                    : ""
                                }
                              />
                              <FaRegFileImage className="" />
                            </button>
                          ) : (
                            dataThisComment[dataComment?.CommentID]
                              ?.base64Url && (
                              <div className="flex-[2] h-full aspect-video overflow-hidden relative">
                                <div
                                  onClick={() =>
                                    handleDeleteImageSubImage(
                                      dataComment?.CommentID
                                    )
                                  }
                                  className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-900 absolute top-0.5 right-0.5 cursor-pointer"
                                ></div>
                                <img
                                  className="w-full h-full object-cover"
                                  src={
                                    dataThisComment[dataComment?.CommentID]
                                      ?.base64Url
                                  }
                                  alt="list_image_edit_post"
                                />
                              </div>
                            )
                          )}

                          <button
                            onClick={() =>
                              handleSubmitSendSubComment(dataComment?.CommentID)
                            }
                            className="flex-1 h-full aspect-square text-blue-500 bg-white hover:shadow-sm my-auto text-xl rounded-r-full hover:bg-blue-500 hover:text-white flex items-center justify-center"
                          >
                            <GrSend />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

      {/* Form comment */}
      <PopupForm
        isShowForm={isShowFormComment}
        position="start"
        setIsShowForm={setIsShowFormComment}
        title={`Bình luận bài viết ${dataThisComment.Title}`}
      >
        <div
          id="custom-pagination"
          className=" w-full h-screen overflow-x-hidden overflow-y-auto pb-10"
        >
          <div className=" rounded-md overflow-hidden">
            <div className="w-full py-2 px-1 backdrop:blur-md flex bg-white justify-between text-black">
              <Moment
                locale="VN"
                format="hh:mm DD/MM/YYYY"
                fromNow
              >{`${dataThisComment?.UpdatePostAt}+0700`}</Moment>
              <h3>#Chủ thớt</h3>
            </div>
            <div className="border-x border-b border-solid border-white rounded-b-md overflow-hidden">
              <Link to={`/profile/${dataThisComment?.UserName}`}>
                <div className="w-full border-b border-solid border-white p-4">
                  <div className=" w-1/12 aspect-square flex justify-start items-center">
                    <img
                      src={dataThisComment?.Avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full mr-3 object-cover"
                      onError={handleErrorImg}
                    />
                    <div>
                      <h1 className=" text-xl font-bold">
                        {dataThisComment?.UserFullName}
                      </h1>
                      <h1 className=" text-lg font-semibold">
                        {dataThisComment?.Bio}
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-4 relative  border-b border-white">
                <h1 className=" text-lg font-semibold mb-4">
                  {dataThisComment?.Title}
                </h1>
                <p>
                  <HandleHiddenText
                    text={dataThisComment?.Content}
                    length={100}
                  />
                </p>

                {Array.isArray(dataThisComment?.listphoto) &&
                  dataThisComment?.listphoto.length > 0 &&
                  dataThisComment?.listphoto.map((dataThisComment, i) => {
                    return (
                      <div
                        key={i}
                        className="w-full h-[50vh] backdrop:blur-md bg-black/80 rounded-lg mt-2"
                      >
                        <img
                          src={dataThisComment?.photo_link}
                          alt="post"
                          className="h-full mx-auto object-contain"
                          onError={handleErrorImg}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="w-full p-4 mb-14">
                <div className="">
                  <lable className="text-md font-bold mb-1 ml-1">Comment</lable>
                  <textarea
                    className=" w-full h-auto py-3 px-2 bg-transparent border-none outline-none rounded-lg shadow-sm shadow-white min-h-10 relative"
                    type="text"
                    placeholder="Comment"
                    value={dataThisComment?.Comment}
                    onChange={(e) =>
                      setDataThisComment((prev) => ({
                        ...prev,
                        Comment: e.target.value,
                        warnComment: "",
                      }))
                    }
                  />
                  <p className="text-xs text-red-500">
                    {dataThisComment?.warnComment}
                  </p>
                </div>
                <div className="mb-3 mt-4">
                  <div className=" flex gap-2 my-3">
                    {Array.isArray(imageBase64s) &&
                      imageBase64s.length > 0 &&
                      imageBase64s.map((item, index) => (
                        <div className=" h-16 aspect-auto rounded-lg overflow-hidden shadow-sm shadow-white relative">
                          <div
                            onClick={() => handleDeleteListImage(index)}
                            className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-900 absolute top-0.5 right-0.5"
                          ></div>
                          <img
                            className="w-full h-full"
                            src={item}
                            alt="list_image_edit_post"
                          />
                        </div>
                      ))}
                  </div>

                  <div className="flex z-50">
                    <div className=" w-16 relative bg-white text-blue-500 hover:text-white hover:bg-blue-500 aspect-square flex items-center justify-center rounded-l-full">
                      <button
                        type="button"
                        className="flex"
                        onClick={() => setShowEmoji(!showEmoji)}
                      >
                        <MdEmojiEmotions className="size-7" />
                      </button>

                      {showEmoji && (
                        <div
                          className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-50"
                          onClick={() => setShowEmoji(false)}
                        >
                          <EmojiPicker
                            onClick={(e) => e.preventDefault()}
                            onEmojiClick={(data) => {
                              setDataThisComment((prev) => ({
                                ...prev,
                                Comment: `${prev.Comment}${data.emoji}`,
                                warnComment: "",
                              }));
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {Array.isArray(imageFiles) && imageFiles.length === 0 && (
                      <button className=" w-16 aspect-square text-blue-500 bg-white my-auto text-xl hover:bg-blue-500 hover:text-white flex items-center justify-center relative">
                        <input
                          type="file"
                          className="absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer"
                          onChange={handlePushImage}
                          value={imageFiles ? "" : ""}
                        />
                        <FaRegFileImage className="" />
                      </button>
                    )}

                    <button
                      onClick={handleSubmitFormPost}
                      className=" w-16 aspect-square text-blue-500 bg-white hover:shadow-sm my-auto text-xl rounded-r-full hover:bg-blue-500 hover:text-white flex items-center justify-center"
                    >
                      <GrSend />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopupForm>
    </div>
  );
}

export default DetailPost;
