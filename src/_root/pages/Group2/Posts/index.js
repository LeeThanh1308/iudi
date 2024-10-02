import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { Pagination } from "antd";
import postIcons from "../../../../images/thread.png";
import { CiCirclePlus } from "react-icons/ci";
import {
  addLikePost,
  addPost,
  deletePost,
  fetchPosts,
  patchPost,
  postsSelector,
} from "../../../../service/redux/posts/postsSlice";
import {
  handleErrorImg,
  handleErrorImgProfile,
  handleErrorPostImgGroup,
  handleFormatNumber,
  slugString,
} from "../../../../service/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import { GoKebabHorizontal } from "react-icons/go";
import { Auth } from "../../../../service/utils/auth";
import PopupForm from "../../../../components/PopupForm";
import { usersSelector } from "../../../../service/redux/users/usersSlice";
import config from "../../../../configs/Configs.json";
const { URL_BASE64, LONGITUDE_DEFAULT, LATITUDE_DEFAULT } = config;

function Posts() {
  const { userID } = new Auth();
  const { user } = useSelector(usersSelector);
  const dispatch = useDispatch();
  const startRef = useRef();
  const endRef = useRef();
  const { groupId } = useParams();
  const [imageBase64s, setImageBase64s] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isShowOptions, setIsShowOptions] = useState({
    state: true,
    postId: null,
  });
  const [isShowFormUpdated, setIsShowFormUpdated] = useState(false);
  const [dataUpdatePost, setDataUpdatePost] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { posts, changeTogglePosts, totalPage, totalPost } =
    useSelector(postsSelector);
  const handleDeletePost = (postID) => {
    const isExist = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?");
    if (isExist) {
      dispatch(deletePost(postID));
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

  const handleChangePage = (page) => {
    setPage(page);
    console.log(startRef, endRef);
    startRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const handleSubmitFormPost = () => {
    const { action, Content, Title } = dataUpdatePost;
    if (!Content || !Title) {
      setDataUpdatePost((prev) => ({
        ...prev,
        warnContent: !Content ? "Trường này không được để trống!" : "",
        warnTitle: !Title ? "Trường này không được để trống!" : "",
      }));
    } else {
      if (!action) {
        const formData = new FormData();
        formData.append("Content", dataUpdatePost?.Content.trim());
        formData.append("Title", dataUpdatePost?.Title.trim());
        if (Array.isArray(imageFiles) && imageFiles.length > 0) {
          imageFiles.map((file) => {
            formData.append("PhotoURL", file);
          });
        }
        formData.append("GroupID", groupId);
        formData.append("PostLatitude", LATITUDE_DEFAULT);
        formData.append("PostLongitude", LONGITUDE_DEFAULT);
        dispatch(addPost({ data: formData, userID }));
      } else {
        dispatch(
          patchPost({
            data: JSON.stringify(
              {
                Content: dataUpdatePost?.Content,
                Title: dataUpdatePost?.Title,
              } ?? ""
            ),
            postID: dataUpdatePost?.PostID,
          })
        );
      }
    }
  };

  useEffect(() => {
    dispatch(fetchPosts({ groupId, userID, page }));
    setIsShowFormUpdated(false);
  }, [groupId, page, userID, changeTogglePosts]);

  useEffect(() => {
    if (!isShowFormUpdated) {
      setImageBase64s([]);
      setImageFiles([]);
    }
  }, [isShowFormUpdated]);
  // console.log(totalPage, totalPost, limit);
  console.log(dataUpdatePost);
  return (
    <React.Fragment>
      {Array.isArray(posts) && posts.length > 0 ? (
        <React.Fragment>
          <div
            onClick={() => {
              setIsShowFormUpdated(true);
              setDataUpdatePost({
                Content: "",
                Title: "",
                action: false,
              });
            }}
            className="mt-4 relative p-5 rounded-lg mobile:border-none mobile:rounded-none mobile:bg-white bg-[#222222] border border-solid border-[#4EC957] cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <img
                className="w-[73px] h-[73px] rounded-full object-cover"
                src={`${user?.avatarLink}`}
                alt="avatar user"
                onError={(e) => handleErrorImg(e.target)}
              />
              <button type="button" className="h-max" title="add post">
                Hãy viết nên suy nghĩ của mình !
              </button>
            </div>

            <div className="mt-3 flex justify-between">
              <button
                title="add post"
                type="button"
                className="relative mobile:border mobile:border-[#deb887] mobile:bg-white bg-[#303030] py-2 px-5 rounded-[20px] flex gap-1 "
              >
                <spa>Ảnh/Video</spa>
              </button>
            </div>
          </div>
          <div className="mt-4">
            {posts.map((item, i) => {
              return (
                <Link
                  className=" text-white font-bold"
                  to={`threads/${slugString(item?.Title)}/${item?.PostID}`}
                  onClick={() => {
                    window.localStorage.setItem(
                      "IsLiked",
                      JSON.stringify({
                        id: item.PostID,
                        isLike: item?.IsFavorited,
                      })
                    );
                  }}
                  key={i}
                  ref={Number(i) === 0 ? startRef : endRef}
                >
                  <div className="flex justify-between px-4 py-3 mb-0.5 my-2 shadow-sm shadow-white hover:shadow-blue-500 rounded-lg cursor-pointer">
                    <div className="flex-[4] flex items-center">
                      <div className="mr-2">
                        <img
                          src={item?.Avatar ?? postIcons}
                          alt="postimage"
                          className="w-14 h-14 object-cover rounded-full overflow-hidden"
                          onError={handleErrorPostImgGroup}
                        />
                      </div>
                      <div>
                        <p className=" text-md font-medium">{item?.Title}</p>
                        <p className=" text-xs font-thin hover:text-blue-500">
                          {item?.UserFullName} -{" "}
                          <Moment
                            locale="VN"
                            fromNow
                          >{`${item?.UpdatePostAt}+0700`}</Moment>
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className=" flex gap-1 text-sm">
                        <p className=" font-medium">Like: </p>
                        <p className=" font-medium">
                          {handleFormatNumber(item?.FavoriteCount)}
                        </p>
                      </div>{" "}
                      <div className=" flex gap-1 text-sm">
                        <p className=" font-medium">Comments: </p>
                        <p className=" font-medium">
                          {handleFormatNumber(item?.Total_comments)}
                        </p>{" "}
                      </div>
                    </div>
                    <div
                      className={` flex-1 flex justify-between items-center gap-2`}
                    >
                      {item?.UserID === userID ? (
                        <div
                          className="p-2 shadow-sm hover:shadow-red-500 rounded-full relative"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsShowOptions({
                              state: true,
                              postId: item?.PostID,
                            });
                          }}
                        >
                          <GoKebabHorizontal />
                          {isShowOptions?.state &&
                            isShowOptions?.postId === item?.PostID && (
                              <div
                                onMouseLeave={() => setIsShowOptions(false)}
                                className="absolute top-full text-sm font-bold left-0 px-5 py-2 backdrop-blur-md shadow-sm shadow-black rounded-lg z-10 flex-col flex gap-2"
                              >
                                <div
                                  onClick={() => {
                                    setIsShowFormUpdated(true);
                                    setDataUpdatePost({
                                      ...item,
                                      action: true,
                                    });
                                    if (
                                      Array.isArray(item?.Photo) &&
                                      item?.Photo.length > 0
                                    ) {
                                      setImageBase64s(item?.Photo);
                                      setImageFiles(item?.Photo);
                                    }
                                  }}
                                  className="hover:text-blue-500 pr-3"
                                >
                                  <p>Edit</p>
                                </div>
                                <div
                                  className="hover:text-red-500 pr-3"
                                  onClick={() => handleDeletePost(item?.PostID)}
                                >
                                  <p>Delete</p>
                                </div>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="p-2"></div>
                      )}

                      <div className="p-2 shadow-sm hover:shadow-red-500 rounded-full">
                        {!item?.IsFavorited ? (
                          <FaRegHeart
                            className="text-white cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(
                                addLikePost({ postId: item?.PostID, userID })
                              );
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
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-3 py-2 px-3 rounded-xl backdrop:blur-md bg-white/20">
            <Pagination
              total={Number(totalPost)}
              pageSize={limit}
              current={Number(page)}
              onChange={handleChangePage}
              showLessItems={false}
              showQuickJumper={false}
              showSizeChanger={false}
              align="center"
            />
          </div>
        </React.Fragment>
      ) : (
        <div>
          <h1 className=" text-xl">Không có bài viết nào...</h1>
        </div>
      )}

      <PopupForm
        isShowForm={isShowFormUpdated}
        setIsShowForm={setIsShowFormUpdated}
        title={
          dataUpdatePost.action
            ? `Sửa bài viết ${dataUpdatePost?.Title}`
            : "Thêm bài viết"
        }
      >
        <div className="mb-3">
          <lable className="text-md font-bold mb-1 ml-1">Title</lable>
          <input
            className=" w-full h-auto py-3 px-2 bg-transparent border-none outline-none rounded-lg shadow-sm shadow-white"
            type="text"
            placeholder="Title"
            value={dataUpdatePost?.Title}
            onChange={(e) =>
              setDataUpdatePost((prev) => ({
                ...prev,
                Title: e.target.value,
                warnTitle: "",
              }))
            }
          />
          <p className="text-xs text-red-500">{dataUpdatePost?.warnTitle}</p>
        </div>

        <div className="mb-3 mt-4">
          <lable className="text-md font-bold mb-1 ml-1">Content</lable>
          <textarea
            className=" w-full h-auto py-3 px-2 bg-transparent border-none outline-none rounded-lg shadow-sm shadow-white min-h-10"
            type="text"
            placeholder="Content"
            value={dataUpdatePost?.Content}
            onChange={(e) =>
              setDataUpdatePost((prev) => ({
                ...prev,
                Content: e.target.value,
                warnContent: "",
              }))
            }
          />
          <p className="text-xs text-red-500">{dataUpdatePost?.warnContent}</p>
        </div>
        <div className="mb-3 mt-4">
          {!dataUpdatePost?.action && (
            <>
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
              <div>
                <button className="h-auto py-3 px-2 bg-transparent outline-none rounded-lg border border-solid border-white relative flex gap-2 items-center justify-center hover:text-blue-500">
                  Thêm ảnh
                  <CiCirclePlus />
                  <input
                    className=" opacity-0 absolute top-0 right-0 left-0 bottom-0"
                    type="file"
                    onChange={handlePushImage}
                  />
                </button>
              </div>
            </>
          )}
          <div className="w-full flex justify-end">
            <button
              onClick={handleSubmitFormPost}
              className="h-auto font-bold py-3 px-8 bg-transparent outline-none rounded-lg border border-solid border-blue-500 text-blue-500 relative flex gap-2 items-center justify-center hover:text-white"
            >
              Update
            </button>
          </div>
        </div>
      </PopupForm>
    </React.Fragment>
  );
}

export default Posts;
