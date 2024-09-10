import { FaPlusCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

import { useEffect, useState } from "react";
import { Auth } from "../../../service/utils/auth";
import axios from "axios";
import config from "../../../configs/Configs.json";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../../service/redux/users/usersSlice";

const { URL_BASE64 } = config;

const PersonalImg = () => {
  const { userID, userName } = new Auth();
  const dispatch = useDispatch();
  const [img, setimg] = useState(null);
  const [dataUploadImage, setDataUploadImage] = useState(null);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  const [listImg, setListImg] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDataUploadImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Url = reader.result.split(",")[1];
      if (base64Url !== img) {
        setimg(base64Url);
        setIsChangeImage(true);
      }
    };
  };

  const handleAddImg = async () => {
    if (isChangeImage) {
      try {
        const formData = new FormData();
        formData.append("idUser", userID);
        formData.append("imageUrl", dataUploadImage);
        const response = await axios
          .post("https://api.iudi.xyz/api/add_person_image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            dispatch(fetchProfile(userName));
          });
        // console.log("Image uploaded successfully:", response.data);

        setimg(null);
        setIsChangeImage(false);
        getImageList();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleRemoveImg = async (imgID) => {
    try {
      const res = await fetch("https://api.iudi.xyz/api/delete_person_image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUser: userID, idImage: imgID }),
      });

      getImageList();
    } catch (error) {
      // console.log(error);
    }

    // console.log("deleted image");
  };

  const handleCancel = () => {
    setimg(null);
    setIsChangeImage(false);
  };

  const getImageList = async () => {
    axios
      .get(`https://api.iudi.xyz/api/list_person_image/${userID}`)
      .then((res) => {
        const dataSort = res.data.data.sort((a, b) => b.idImage - a.idImage);
        setListImg(dataSort);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getImageList();
  }, []);

  const listImg2 = showAllImages ? listImg : listImg.slice(0, 5);
  // console.log(listImg2, listImg);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex m-auto items-center gap-4">
        <div className="pc:w-[250px] pc:h-[250px] pc:rounded-[20px] w-[180px] h-[180px] overflow-hidden rounded-xl bg-[#262D34] border border-[#4EC957]  relative">
          <input
            type="file"
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            onChange={handleImageChange}
          />
          <span className="flex items-center justify-center h-[100%]">
            <FaPlusCircle className="text-white" />
          </span>
          {img && (
            <img
              src={`${URL_BASE64}${img}`}
              alt="img"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddImg}
            className=" text-sm text-white rounded shadow bg-green px-11 py-4"
          >
            Thêm ảnh
          </button>

          <button
            onClick={handleCancel}
            className=" text-sm text-white rounded shadow border border-green px-11 py-4"
          >
            Huỷ
          </button>
        </div>
      </div>

      <div className="bg-[#262D34] border border-[#4EC957] rounded-xl p-4">
        <div className="flex flex-wrap gap-5 justify-center">
          {listImg2.map(({ idImage, imageUrl }) => (
            <div
              className="pc:w-[250px] pc:h-[250px] pc:rounded-[20px] w-[180px] h-[180px] rounded-xl overflow-hidden relative group"
              key={idImage}
            >
              <img
                src={`${imageUrl}`}
                alt=""
                className=" w-full h-full object-cover"
                onError={(e) => (e.target.src = URL_BASE64 + imageUrl)}
              />

              <button
                onClick={() => handleRemoveImg(idImage)}
                className="absolute right-[10px] top-[10px] hidden text-black text-xl duration-200 transition-all opacity-0 group-hover:block group-hover:opacity-100"
              >
                <IoCloseCircle />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3">
          {listImg.length > 5 && (
            <button
              className="text-blue-600 block mx-auto"
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
    </div>
  );
};

export default PersonalImg;
