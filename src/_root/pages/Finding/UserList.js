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
    infinite: false,
    speed: 500,
    rows: 2,
    slidesToShow: 5,
    slidesToScroll: 5,

    dotsClass: "dost-slider-custom",

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
      {/* <div className=" w-full h-screen bg-black"></div> */}
      {users.map(
        (
          {
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
          },
          index
        ) => {
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
            <div className={`z-0 h-[40vh] p-2 overflow-hidden`} key={UserID}>
              <div className="z-10 h-full w-full rounded-xl overflow-hidden shadow-md shadow-red-500">
                <div className=" h-1/4 w-full overflow-hidden relative flex justify-start items-center px-2">
                  <div className=" w-1/6 aspect-square rounded-full overflow-hidden shadow shadow-white bg-white text-white shrink-0 m-2">
                    <LazyLoad>
                      <>
                        <img
                          src={avatarLink}
                          alt="avatar"
                          className=" w-full h-full object-cover"
                        />
                      </>
                    </LazyLoad>
                  </div>
                  <div className=" mt-3 w-auto overflow-hidden">
                    <h1 className=" text-xl font-bold">{FullName}</h1>
                    <p className="mb-2 text-xs limit-text text-justify">
                      {Bio}
                    </p>
                  </div>
                </div>
                <div className=" h-3/4 w-full bg-white m-3 flex flex-col justify-between items-center rounded-tl-lg">
                  <div className="h-full p-3 w-full text-md overflow-hidden flex flex-col  items-start justify-between">
                    <div>
                      <ul className="flex flex-col">
                        {dataUser.map(({ id, name, icon }) => {
                          if (name) {
                            return (
                              <li key={id} className="flex items-center">
                                <div className="mr-1 text-red-400">{icon}</div>
                                <p className="">{name}</p>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </div>

                    <div className="mx-auto mb-3">
                      <div>
                        <button
                          className="font-bold text-white bg-[#50C759] rounded-[20px] hover:bg-[#1e5f24] duration-200 px-3 py-2"
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
            </div>
          );
        }
      )}
    </Slider>
  );
};
export default UserList;
