import React, { useState } from "react";
import axios from "axios";

import { useForm } from "react-hook-form";
import { groupSchema } from "../../../../service/schemas/schemas";
import { toast } from "react-toastify";

import { AiFillCloseCircle } from "react-icons/ai";
import Modal from "react-modal";

import { useSelector } from "react-redux";
import { usersSelector } from "../../../../service/redux/users/usersSlice";

import { handleErrorImg } from "../../../../service/utils/utils";

import uploadFile from "../../../../images/icons/uploadFile.png";

import config from "../../../../configs/Configs.json";
import { Auth } from "../../../../service/utils/auth";
import { joiResolver } from "@hookform/resolvers/joi";

const { URL_BASE64, API__SERVER } = config;

const FormGroup = ({ data }) => {
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",

      width: "400px",
      height: "max-content",
      background: "#1a1919",
      color: "white",
      padding: "0 !important",
      border: "none",
    },

    overlay: {
      background: "rgba(0, 0, 0,.7)",
    },
  };

  const { onHidden, showModal, onChangeGroups } = data;

  const { userID, userName } = new Auth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: joiResolver(groupSchema) });

  const userState = useSelector(usersSelector);

  const [inputFileImage, setInputFileImage] = useState({
    file: "",
    imageUpload: null,
    fileAvatar: null,
  });

  const { imageUpload, file } = inputFileImage;

  const handleChangeUploadImage = (e) => {
    let file = e.target.files[0];
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Url = reader.result.split(",")[1];
      setInputFileImage({
        ...inputFileImage,
        imageUpload: base64Url,
        file: e.target.value,
        fileAvatar: file,
      });

      setValue("avatarLink", base64Url);
    };
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("GroupName", data.GroupName);
      formData.append("userNumber", data.userNumber);
      formData.append("avatarLink", inputFileImage.fileAvatar);
      console.log(inputFileImage);
      const res = await axios.post(
        `${API__SERVER}/forum/group/add_group/${userID}`,
        formData
      );

      toast.success("Group added successfully!");
      reset();
      onHidden();
      onChangeGroups();
      setInputFileImage({
        imageUpload: null,
        file: null,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel="Modal Form"
    >
      <div className="mobile:bg-[#008748] relative flex justify-center p-2 border-b border-solid border-b-white">
        <h2 className="text-white">Create a group</h2>
        <button
          className="absolute right-2 top-[50%] translate-y-[-50%] text-lg text-white"
          onClick={onHidden}
          type="button"
        >
          <AiFillCloseCircle />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        <div className="flex items-center gap-2">
          <div>
            <img
              className="w-[50px] h-[50px] rounded-full object-cover"
              src={`${URL_BASE64}${userState.user.avatarLink}`}
              alt="avatar user"
              onError={(e) => handleErrorImg(e.target)}
            />
          </div>
          <h2>{userName}</h2>
        </div>

        <div>
          <input
            className="mt-3 bg-transparent focus-visible:outline-none"
            type="text"
            placeholder="Group name"
            {...register("GroupName")}
          />
          {errors.GroupName && (
            <p className="mt-2 text-sm ipad:mt-1 ipad:text-xs ipad:font-semibold tablet:mt-1 tablet:text-xs tablet:font-semibold font-bold text-red-500">
              {errors.GroupName.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="mt-3 bg-transparent focus-visible:outline-none"
            type="number"
            placeholder="Number members"
            {...register("userNumber")}
          />

          {errors.userNumber && (
            <p className="mt-2 text-sm ipad:mt-1 ipad:text-xs ipad:font-semibold tablet:mt-1 tablet:text-xs tablet:font-semibold font-bold text-red-500">
              {errors.userNumber.message}
            </p>
          )}
        </div>

        {imageUpload && (
          <div className="relative rounded-lg overflow-hidden h-[150px]">
            <img
              className="object-cover object-center w-full h-full"
              src={`${URL_BASE64}${imageUpload}`}
              alt="image group"
            />

            <button
              className="absolute text-xl text-gray-900 transition right-2 top-2 hover:text-black"
              onClick={() => {
                setInputFileImage({
                  imageUpload: null,
                  file: null,
                });
                setValue("avatarLink", "");
              }}
              type="button"
            >
              <AiFillCloseCircle />
            </button>
          </div>
        )}
        <div className="relative my-3 w-max text-white mobile:bg-[#008748] bg-[#303030] py-2 px-5 rounded-md">
          <div className="flex gap-1">
            <img src={uploadFile} alt="upload file" />
            <span>Upload</span>
          </div>

          <input
            className="absolute z-10 inset-0 opacity-0 focus-visible:outline-none"
            type="file"
            name="image"
            value={file}
            onChange={handleChangeUploadImage}
          />
        </div>

        {errors.avatarLink && (
          <p className="my-2 text-sm ipad:mt-1 ipad:text-xs ipad:font-semibold tablet:my-1 tablet:text-xs tablet:font-semibold font-bold text-red-500">
            {errors.avatarLink.message}
          </p>
        )}

        <button
          className="w-full py-2 rounded-md text-white bg-[#008748]"
          type="submit"
        >
          Create
        </button>
      </form>
    </Modal>
  );
};

export default FormGroup;
