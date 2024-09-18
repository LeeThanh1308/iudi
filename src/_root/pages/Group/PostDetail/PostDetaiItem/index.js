import axios from "axios";
import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";

import { ToastContainer } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchDetailPost,
  postComment,
  postsSelector,
} from "../../../../../service/redux/posts/postsSlice";
import { usersSelector } from "../../../../../service/redux/users/usersSlice";

import uploadFile from "../../../../../images/icons/uploadFile.png";

import config from "../../../../../configs/Configs.json";
import { Auth } from "../../../../../service/utils/auth";
import FormPost from "../../GroupDetail/FormPost";
import PostItem from "../../GroupDetail/PostItem";

import NavMobile from "../../../../../components/NavMobile/NavMobile";
import { handleErrorImg } from "../../../../../service/utils/utils";

const { API__SERVER, URL_BASE64 } = config;

const PostDetailItem = () => {
  const { userID } = new Auth();
  const { groupId, postId } = useParams();
  const [postList, setPostList] = useState([]);

  const { post: posts, changeTogglePosts } = useSelector(postsSelector);
  const userState = useSelector(usersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    groupId && dispatch(fetchDetailPost({ groupId, postId }));
  }, [changeTogglePosts, postId]);

  useEffect(() => {
    if (posts[0]) {
      const { listcomment, ...args } = posts[0] || {};
      setPostList([{ ...args, comments: listcomment ?? [] }]);
    }
  }, [posts]);

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
      <div>
        {Array.isArray(posts) && posts.length > 0 && (
          <ul>
            {postList?.length > 0 ? (
              postList?.map(
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
                    // console.log(imageUrl);
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
        )}
      </div>
      <NavMobile />
      {/* <FormPost modal={modal} hiddenModal={handleHiddenModal} /> */}
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default PostDetailItem;
