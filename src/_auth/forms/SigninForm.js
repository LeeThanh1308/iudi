import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../service/schemas/schemas";
import config from "../../configs/Configs.json";

const { LONGITUDE_DEFAULT, LATITUDE_DEFAULT, LAST_LOGIN_IP_DEFAULT } = config;

function SigninForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({ resolver: joiResolver(loginSchema) });

  useEffect(() => {
    const fetchData = async () => {
      fetch("http://www.geoplugin.net/json.gp?ip")
        .then((response) => response.json())
        .then((data) => {
          setValue("Latitude", data.geoplugin_latitude);
          setValue("Longitude", data.geoplugin_longitude);
          setValue("LastLoginIP", data.geoplugin_request);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);

          setValue("Latitude", LONGITUDE_DEFAULT);
          setValue("Longitude", LATITUDE_DEFAULT);
          setValue("LastLoginIP", LAST_LOGIN_IP_DEFAULT);
        });
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (isValid) {
      try {
        const response = await axios.post(
          "https://api.iudi.xyz/api/login",
          data
        );
        const user = response?.data?.user?.Users[0];

        // console.log("response:", response);
        // console.log("Phản hồi từ API:", response?.data);

        localStorage.setItem("IuDiToken", response?.data?.jwt);
        localStorage.setItem("UserId", user?.UserID);
        localStorage.setItem("UserNameIuDi", user?.Username);

        toast.success("Login successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 1,
          theme: "light",
        });

        navigate("/personal");

        // setTimeout(() => {
        //  window.location.reload()
        // }, 1000)
      } catch (error) {
        console.error("Error registering:", error);
        toast.error(`Login failed! ${error.response.data.message}`, {
          closeOnClick: true,
        });
      }
    } else toast.warning("An error occur...");
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
      className="absolute inset-0 flex items-center justify-center mobile:hidden"
      style={{ background: "rgba(255, 255, 255, .3)" }}
    >
      <div className="max-w-md w-full mx-auto border-2 border-green-400 rounded-[20px] bg-gray-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-8 pt-6 pb-8 mb-4 rounded "
        >
          <h3
            style={{
              color: "rgba(44,186,55,0.8127626050420168)",
            }}
            className="mt-2 mb-2 text-3xl font-extrabold text-center text-white"
          >
            LOGIN
          </h3>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-whitetext-sm"
              htmlFor="Username"
              style={{
                color: "rgba(44,186,55,0.8127626050420168)",
              }}
            >
              Username
            </label>
            <input
              className="w-full px-3 py-2 border rounded shadow appearance-none text-whiteleading-tight focus:outline-none focus:shadow-outline"
              id="Username"
              type="text"
              placeholder="Username"
              name="Username"
              {...register("Username")}
            />

            {errors.Username && (
              <p className="mt-2 text-sm font-bold text-red-500">
                {errors.Username.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 font-bold text-whitetext-sm"
              htmlFor="Password"
              style={{
                color: "rgba(44,186,55,0.8127626050420168)",
              }}
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 border rounded shadow appearance-none text-whiteleading-tight focus:outline-none focus:shadow-outline"
              id="Password"
              type="password"
              placeholder="Password"
              name="Password"
              {...register("Password")}
            />
            {errors.Password && (
              <p className="mt-2 text-sm font-bold text-red-500">
                {errors.Password.message}{" "}
              </p>
            )}
          </div>
          <div className="mb-4">
            <button
              style={{
                background: "rgba(44,186,55,0.8127626050420168)",
              }}
              className="w-full px-4 py-2 mt-2 font-bold text-white rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
          <p
            className="text-sm text-center text-white"
            style={{
              color: "rgba(44,186,55,0.8127626050420168)",
            }}
          >
            Don't have an account ?
            <a href="/register" className="ml-2 text-500">
              <strong>REGISTER</strong>
            </a>
          </p>
          <p className="mt-2 text-center text-green-600">
            <a href="/forgot-password" className="text-white text-200">
              <strong>Forgot password ?</strong>
            </a>
          </p>
        </form>

        {/* <ToastContainer /> */}
      </div>
    </div>
  ) : (
    <div className="px-4 flex flex-1 flex-col justify-between">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1 mb-3">
          <label className="text-sm font-medium" htmlFor="username">
            Username
          </label>

          <input
            className="focus:outline-none py-1 px-2 text-sm rounded-[10px] border border-[#D9D9D9] border-solid "
            type="text"
            id="username"
            {...register("Username")}
          />

          {errors["Username"] && (
            <p className="text-sm font-medium text-red-500">
              {errors[`Username`].message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>

          <input
            className="focus:outline-none py-1 px-2 text-sm rounded-[10px] border border-[#D9D9D9] border-solid "
            type="password"
            id="password"
            {...register("Password")}
          />

          {errors["Password"] && (
            <p className="text-sm font-medium text-red-500">
              {errors[`Password`].message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="mt-3 hover:bg-green transition-all duration-200 w-full rounded-[10px] py-[5px] text-center text-sm bg-[#149157] font-bold text-white"
          >
            Login
          </button>
        </div>
      </form>

      <div className="flex-1 flex flex-col mb-[30px] justify-end gap-3">
        <div className="flex justify-center gap-1 items-center">
          <p className="font-poppins text-[14px] font-medium">
            Bạn đã có tài khoản chưa?
          </p>

          <Link to="/register" className="text-green text-[14px] font-poppins">
            Đăng ký
          </Link>
        </div>

        <Link to="/forgot-password" className="text-center">
          <strong className="mt-2 text-center text-green text-200">
            Forgot password ?
          </strong>
        </Link>
      </div>

      {/* <ToastContainer /> */}
    </div>
  );
}
export default SigninForm;
