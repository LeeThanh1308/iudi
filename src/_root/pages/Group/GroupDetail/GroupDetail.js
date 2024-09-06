import axios from "axios";
import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";

import { ToastContainer } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchPosts,
  postComment,
  postsSelector,
} from "../../../../service/redux/posts/postsSlice";
import { usersSelector } from "../../../../service/redux/users/usersSlice";

import uploadFile from "../../../../images/icons/uploadFile.png";

import config from "../../../../configs/Configs.json";
import { Auth } from "../../../../service/utils/auth";
import FormPost from "./FormPost";
import PostItem from "./PostItem";

import NavMobile from "../../../../components/NavMobile/NavMobile";
import { handleErrorImg } from "../../../../service/utils/utils";

const { API__SERVER, URL_BASE64 } = config;

const GroupDetail = () => {
  const { userID } = new Auth();
  const { groupId } = useParams();
  const [postList, setPostList] = useState([]);

  const { posts, changeTogglePosts } = useSelector(postsSelector);
  const userState = useSelector(usersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    groupId && userID && dispatch(fetchPosts({ groupId, userID }));
  }, [changeTogglePosts, groupId]);

  useEffect(() => {
    const newPosts = [];
    posts.length > 0
      ? posts.forEach(async (post, index) => {
          const comments = await getComments(post.PostID);
          const newPost = { ...post, comments };
          newPosts.push(newPost);

          if (index === posts.length - 1) setPostList(newPosts);
        })
      : setPostList(newPosts);
  }, [posts]);

  console.log(postList);

  const [modal, setModal] = useState({
    showModal: false,
    method: "post",
    post: {},
  });

  const handleShowModal = (name, post) => {
    if (!userID) {
      Swal.fire({
        title: "Not logged in yet",
        text: "Please log in to your account!",
        icon: "info",
      });

      return;
    }

    setModal({
      showModal: true,
      post: post,
      method: name === "post" ? "post" : "patch",
    });
  };
  const handleHiddenModal = () => setModal({ ...modal, showModal: false });

  const getComments = async (postID) => {
    const { data } = await axios.get(
      `${API__SERVER}/forum/comment/${postID}/${userID}`
    );
    return data.Comments;
  };

  return (
    <div className="mobile:bg-[#ECECEC] mobile:min-h-screen mobile:pb-[100px]">
      <div className="relative p-5 rounded-lg mobile:border-none mobile:rounded-none mobile:bg-white bg-[#222222] border border-solid border-[#4EC957]">
        <div className="flex gap-2 items-center">
          <img
            className="w-[73px] h-[73px] rounded-full object-cover"
            src={`${userState.user.avatarLink}`}
            alt="avatar user"
            onError={(e) => handleErrorImg(e.target)}
          />
          <button
            type="button"
            className="h-max"
            onClick={() => handleShowModal("post", {})}
            title="add post"
          >
            Hãy viết nên suy nghĩ của mình !
          </button>
        </div>

        <div className="mt-3 flex justify-between">
          <button
            title="add post"
            onClick={() => handleShowModal("post", {})}
            type="button"
            className="relative mobile:border mobile:border-[#deb887] mobile:bg-white bg-[#303030] py-2 px-5 rounded-[20px] flex gap-1 "
          >
            <img src={uploadFile} alt="upload file" />
            <spa>Ảnh/Video</spa>
          </button>

          {/* <button type='submit' className='bg-[#4EC957] rounded-[20px]  py-2 px-5'>
      Đăng
     </button> */}
        </div>
      </div>

      <div>
        <ul>
          {postList.length > 0 ? (
            postList.map(
              ({
                Content,
                PhotoURL,
                PostID,
                UserFullName,
                Avatar,
                FavoriteCount,
                FirstComment,
                Title,
                UpdatePostAt,
                Photo,
                IsFavorited,
                comments,
                Username,
                UserID,
              }) => {
                const btnRef = React.createRef();
                const commentRef = React.createRef();
                const inputCommentRef = React.createRef();

                const handleSubmitComment = (e, imageUrl) => {
                  e.preventDefault();
                  console.log(imageUrl);
                  const value = inputCommentRef.current.value;
                  if (value.trim() === "" && imageUrl === null) return;
                  const data = {
                    Content: value,
                    PhotoURL: imageUrl,
                    ReplyID: null,
                  };

                  dispatch(postComment({ PostID, data, userID }));
                  inputCommentRef.current.value = "";

                  // console.log(data);
                };

                const handleShowComments = () => {
                  commentRef.current.classList.remove("hidden");
                  inputCommentRef.current.focus();
                };

                const imgAvatarRef = React.createRef();
                const imgPhotoRef = React.createRef();

                return (
                  <PostItem
                    key={PostID}
                    data={{
                      Content,
                      PhotoURL,
                      PostID,
                      UserFullName,
                      Avatar,
                      FavoriteCount,
                      FirstComment,
                      Title,
                      UpdatePostAt,
                      Photo,
                      IsFavorited,
                      comments,
                      Username,
                      UserID,
                    }}
                    handle={{
                      imgAvatarRef,
                      imgPhotoRef,
                      btnRef,
                      handleShowModal,
                      handleShowComments,
                      handleSubmitComment,
                      inputCommentRef,
                      commentRef,
                    }}
                  />
                );
              }
            )
          ) : (
            <li className="mt-5 text-center">
              <h2>KHÔNG CÓ BÀI VIẾT NÀO</h2>
            </li>
          )}
        </ul>
      </div>
      <NavMobile />
      <FormPost modal={modal} hiddenModal={handleHiddenModal} />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default GroupDetail;
