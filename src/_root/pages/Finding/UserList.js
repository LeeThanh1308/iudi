import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import { AiOutlineHome, AiOutlineMail } from "react-icons/ai";
import { LuMapPin } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import {
  MdOutlineDateRange,
  MdOutlineLocalPhone,
  MdOutlineWhereToVote,
} from "react-icons/md";

import bgProfile from "../../../images/profiles/bg-profile.png";

import { handleErrorImg } from "../../../service/utils/utils";
import LazyLoad from "react-lazy-load";

// import configs from "../../../configs/Configs.json";
// const { URL_BASE64 } = configs;

const UserList = ({ users }) => {
  const navigate = useNavigate();

  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

    dotsClass: "dost-slider-custom",

    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],

    customPaging: (i) => {
      return (
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",

            border: "1px solid #4EC957",
          }}
        ></div>
      );
    },
  };

  return (
    <Slider {...settings}>
      {users.map(
        ({
          UserID,
          avatarLink,
          PhotoURL,
          FullName,
          Distance,
          Bio,
          Phone,
          Email,
          BirthDate,
          BirthPlace,
          CurrentAdd,
        }) => {
          const dataUser = [
            {
              id: 1,
              name: FullName,
              icon: <FaRegUser />,
            },

            {
              id: 2,
              name: Phone,
              icon: <MdOutlineLocalPhone />,
            },

            {
              id: 3,
              name: Email,
              icon: <AiOutlineMail />,
            },

            {
              id: 4,
              name: BirthDate,
              icon: <MdOutlineDateRange />,
            },

            {
              id: 5,
              name: BirthPlace,
              icon: <MdOutlineWhereToVote />,
            },
            {
              id: 6,
              name: CurrentAdd,
              icon: <AiOutlineHome />,
            },
            {
              id: 7,
              name: Math.floor(Distance / 1000) + "Km",
              icon: <LuMapPin />,
            },
          ];

          return (
            <div className="flex items-center justify-center py-3" key={UserID}>
              <div className="bg-white mx-auto rounded-[30px] ipad:max-w-[360px] w-[550px] overflow-hidden border-2  border-[#4EC957]">
                <div
                  style={{
                    background: `center/cover no-repeat  url(${bgProfile})`,
                  }}
                  className="w-full h-[150px] ipad:h-[110px]"
                ></div>

                <div className="mt-[-80px] z-[1] ipad:mt-[-50px]">
                  <LazyLoad>
                    <>
                      <img
                        onError={(e) => handleErrorImg(e.target)}
                        src={`${avatarLink}`}
                        alt="avatar user"
                        className="mx-auto ipad:w-[80px] ipad:h-[80px] text-white rounded-full h-[130px] w-[130px] object-cover  border-2 border-pink-100"
                      />
                    </>
                  </LazyLoad>
                </div>

                <div className="px-[50px] pb-5 ipad:p-3">
                  <div className="text-center mt-5">
                    <h4 className="mx-auto font-inter leading-tight font-bold text-[40px] capitalize ipad:text-[30px]">
                      {FullName}
                    </h4>

                    <p
                      className="mb-2 text-[25px] italic text-[#8E8E8E] ipad:text-[16px]"
                      style={{
                        overflowWrap: "break-word",
                      }}
                    >
                      {Bio}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-4 mt-[30px] ipad:gap-2 ipad:mt-[20px]">
                    {dataUser.map(({ id, name, icon }) => {
                      if (name) {
                        return (
                          <li key={id} className="flex gap-5 items-center">
                            <div className="text-2xl ipad:text-xl">{icon}</div>
                            <p className="text-xl ipad:text-lg">{name}</p>
                          </li>
                        );
                      }
                    })}
                  </ul>

                  <div className="flex justify-center gap-5 mb-5 mt-[50px] ipad:my-3">
                    <div>
                      <button
                        className="py-4 ipad:p-3 ipad:text-lg ipad:rounded-xl text-xl px-5 font-bold text-white bg-[#50C759] rounded-[20px] hover:bg-[#1e5f24] duration-200"
                        onClick={() => {
                          navigate(`/message/${UserID}`, {
                            state: {
                              userName: FullName,
                              isOnline: true,
                              avatar: avatarLink,
                            },
                          });
                        }}
                      >
                        Nhắn tin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}
    </Slider>
  );
};
export default UserList;
