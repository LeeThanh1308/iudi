import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import { registerSchema } from "../../service/schemas/schemas";

const FormField = ({ label, register, errors, type, name }) => {
  return (
    <div className="mb-4 ipad:mb-3 tablet:mb-3">
      <label
        className="block mb-2 font-bold ipad:text-xs ipad:mb-1 ipad:font-semibold tablet:mb-1 tablet:font-semibold tablet:text-xs text-[#50C759] text-sm"
        htmlFor={name}
      >
        {label}
      </label>

      {type === "select" ? (
        <select
          className="focus:outline-none w-full px-3 py-2  tablet:px-2 tablet:text-sm  ipad:px-2 ipad:text-sm border rounded"
          id={name}
          {...register(`${name}`)}
        >
          <option>Nam</option>
          <option>Nữ</option>
          <option>Đồng tính Nam</option>
          <option>Đồng tính nữ</option>
        </select>
      ) : (
        <input
          className="w-full tablet:py-1  tablet:text-sm ipad:py-1  ipad:text-sm px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
          id={name}
          type={type}
          placeholder={label}
          name={name}
          {...register(`${name}`)}
        />
      )}

      {errors[`${name}`] && (
        <p className="mt-2 text-sm ipad:mt-1 ipad:text-xs ipad:font-semibold tablet:mt-1 tablet:text-xs tablet:font-semibold font-bold text-red-500">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

const FormFieldMobile = ({ label, register, errors, type, name }) => {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="font-medium text-sm" htmlFor={name}>
        {label}
      </label>

      {type === "select" ? (
        <select
          className="focus:outline-none w-full py-1 px-2 text-sm border border-[#D9D9D9] border-solid rounded-[10px]"
          id={name}
          {...register(name)}
        >
          <option>Nam</option>
          <option>Nữ</option>
          <option>Đồng tính Nam</option>
          <option>Đồng tính nữ</option>
        </select>
      ) : (
        <input
          className="focus:outline-none py-1 px-2 text-sm rounded-[10px] border border-[#D9D9D9] border-solid "
          type={type}
          name={name}
          id={name}
          {...register(name)}
        />
      )}

      {errors[`${name}`] && (
        <p className="text-sm font-medium text-red-500">
          {errors[`${name}`].message}
        </p>
      )}
    </div>
  );
};

const SignupForm = () => {
  const [sta, setSta] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({ resolver: joiResolver(registerSchema) });

  const navigate = useNavigate();

  const dataForm = [
    {
      id: 1,
      label: "Username",
      name: "Username",
      type: "text",
      register,
      errors,
    },

    {
      id: 2,
      label: "Full Name",
      name: "FullName",
      type: "text",
      register,
      errors,
    },

    {
      id: 3,
      label: "Email",
      name: "Email",
      type: "email",
      register,
      errors,
    },

    {
      id: 4,
      label: "Gender",
      name: "Gender",
      type: "select",
      register,
      errors,
    },

    {
      id: 5,
      label: "Password",
      name: "Password",
      type: "password",
      register,
      errors,
    },

    {
      id: 6,
      label: "Confirm Password",
      name: "Cf_Password",
      type: "password",
      register,
      errors,
    },
  ];

  const getLocation = () => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            // Vị trí đã được cho phép
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              setValue("Latitude", latitude);
              setValue("Longitude", longitude);
              setValue(
                "avatarLink",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9Zde21fi2AnY9_C17tqYi8DO25lRM_yAa7Q&usqp=CAU&fbclid=IwAR16g1ONptpUiKuDIt37LRxU3FTZck1cv9HDywe9VWxWSQBwcuGNfB7JUw4"
              );
              setValue("LastLoginIP", "1");
            });
            setSta(true);
          } else if (permissionStatus.state === "prompt") {
            // Hiển thị cửa sổ xác nhận yêu cầu vị trí
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              setValue("Latitude", latitude);
              setValue("Longitude", longitude);
              setValue(
                "avatarLink",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9Zde21fi2AnY9_C17tqYi8DO25lRM_yAa7Q&usqp=CAU&fbclid=IwAR16g1ONptpUiKuDIt37LRxU3FTZck1cv9HDywe9VWxWSQBwcuGNfB7JUw4"
              );
              setValue("LastLoginIP", "1");
              setSta(true);
            }, alert("Vui lòng mở vị trí trước khi tiếp tục!") && setSta(false));
          } else if (permissionStatus.state === "denied") {
            // Vị trí bị từ chối
            alert("Vui lòng mở vị trí trước khi tiếp tục!");
            setSta(false);
          }
        });
    } else {
      alert(
        "Trình duyệt không hỗ trợ geolocation hoặc trình duyệt chặn truy cập vị trí, vui lòng kiểm tra!."
      );
      setSta(false);
    }
  };

  useEffect(() => {
    getLocation();
    window.addEventListener("GeolocationPermissionChangeEvent", getLocation);
  }, []);

  const handleSubmitForm = async (data) => {
    // console.log(data);

    if (isValid) {
      try {
        const response = await axios.post(
          "https://api.iudi.xyz/api/register",
          data
        );
        toast.success("Register successfully!");
        reset();
      } catch (error) {
        console.error("Error registering:", error);
        toast.error(`Register failed! ${error.response.data.message}`, {
          closeOnClick: true,
        });
      }
    }
  };

  const [showMobile, setShowMobile] = useState(false);
  const decktopRef = useRef();

  useEffect(() => {
    const isDecktopHidden = decktopRef?.current?.offsetWidth === 0;
    isDecktopHidden ? setShowMobile(true) : setShowMobile(false);
  }, [decktopRef]);

  return !showMobile ? (
    <div
      ref={decktopRef}
      className="mobile:hidden absolute inset-0 flex items-center justify-center"
      style={{ background: "rgba(255, 255, 255, .3)" }}
    >
      <div className="max-w-md tablet:max-w-sm ipad:max-w-sm w-full mx-auto border-2 border-green-400 rounded-[20px] bg-gray-900">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="p-7 tablet:p-5 ipad:p-5 rounded "
        >
          <h3 className="mt-2 mb-2 text-3xl tablet:text-xl ipad:text-xl font-extrabold text-center text-[#50C759] ">
            REGISTER
          </h3>

          {dataForm.map((field) => (
            <FormField
              key={field.id}
              register={register}
              errors={errors}
              {...field}
            />
          ))}

          <div className="mb-4 tablet:mb-3">
            <button
              style={{
                background:
                  "linear-gradient(90deg, rgba(29,120,36,1) 0%, rgba(44,186,55,0.8127626050420168) 90%, rgba(0,255,68,1) 100%)",
              }}
              className={`w-full px-3 py-2 ${
                sta ? "" : "bg-black"
              } font-bold tablet:font-semibold text-lg tablet:text-sm ipad:text-sm ipad:font-semibold  rounded focus:outline-none text-white`}
              type="submit"
              disabled={!sta}
            >
              Register
            </button>
          </div>
          <p
            className="text-sm text-center"
            style={{
              color: "rgba(44,186,55,0.8127626050420168)",
            }}
          >
            Already have an account ?{" "}
            <a href="/login" className="text-500">
              <strong>LOG IN</strong>
            </a>
          </p>
        </form>
      </div>

      {/* <ToastContainer /> */}
    </div>
  ) : (
    <div className="px-4 flex flex-col flex-1 justify-between">
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        {dataForm.map((data) => (
          <FormFieldMobile
            key={data.id}
            {...data}
            register={register}
            errors={errors}
          />
        ))}

        <div>
          <button
            type="submit"
            className="mt-3 hover:bg-green transition-all duration-200 w-full rounded-[10px] py-[5px] text-center text-sm bg-[#149157] font-bold text-white"
          >
            Register
          </button>
        </div>
      </form>

      <div className="flex flex-1 justify-center gap-1 items-center">
        <p className="font-poppins text-[14px] font-medium">
          Bạn đã có tài khoản chưa?
        </p>

        <Link to="/login" className="text-green text-[14px] font-poppins">
          Đăng nhập
        </Link>
      </div>

      {/* <ToastContainer /> */}
    </div>
  );
};

export default SignupForm;
