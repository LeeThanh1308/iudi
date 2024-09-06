import React, { useState, useRef } from "react";

import { useForm } from "react-hook-form";
import LazyLoad from "react-lazy-load";
import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";

import Slider from "react-slick";
import dayjs from "dayjs";

import BgImage from "../../../images/bg3.jpg";
import Logo from "../../../images/logoApp.png";

import { formCreateInfoData } from "../../../components/shared/globalData";

import SlideItem from "./SlideItem";

const CreateInfoUser = () => {
  const styles = {
    background: `no-repeat center/cover url(${BgImage})`,
    height: "100vh",
  };

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "create-info slick-dots",

    customPaging: (i) => {
      return (
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",

            border: "1px solid #4EC957",
          }}
        ></div>
      );
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // *___________ handle birthdate_____________

  ClassNameGenerator.configure((LocalizationProvider) =>
    LocalizationProvider.replace("Mui", "InfoUser")
  );

  const [dateValue, setDateValue] = useState(null);
  const handleChangeDate = (value) => {
    setDateValue(value);
  };

  //  console.log(dayjs(dateValue).format('YYYY-MM-DD'))

  let sliderRef = useRef(null);
  const handleNext = () => {
    sliderRef.slickNext();
  };

  const handleSubmitForm = (data) => {
    console.log(data);
  };

  //  const [text, setText] = React.useState('')
  return (
    <section>
      <div style={styles} className="flex">
        <div className="mx-auto">
          <div className="mt-[125px]">
            <LazyLoad>
              <>
                <img className="mx-auto" src={Logo} alt="logo" />
              </>
            </LazyLoad>
          </div>

          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className=" w-[80vw] h-[70vh] px-[50px] py-[150px] rounded-[20px] border border-1 border-greenlight"
          >
            <Slider
              {...settings}
              ref={(slider) => {
                sliderRef = slider;
              }}
            >
              {formCreateInfoData.map(
                ({ id, label, placeholder, type, key }) => (
                  <SlideItem
                    key={id}
                    data={{
                      id,
                      label,
                      placeholder,
                      type,
                      key,
                      handleChangeDate,
                      handleNext,
                      register: register,
                    }}
                  />
                )
              )}
            </Slider>

            <button className="text-white" type="submit">
              submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateInfoUser;
