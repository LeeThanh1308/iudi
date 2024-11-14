import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { registerSchema } from "../../service/schemas/schemas";

const FormField = ({ label, errors, touched, type, name, ...props }) => {
  return (
    <div className="mb-4 ipad:mb-3 tablet:mb-3">
      <label className="block mb-2 font-bold ipad:text-xs ipad:mb-1 ipad:font-semibold tablet:mb-1 tablet:font-semibold tablet:text-xs text-[#50C759] text-sm">{label}</label>
      {type === "select" ? (
        <select {...props} className="focus:outline-none w-full px-3 py-2  tablet:px-2 tablet:text-sm  ipad:px-2 ipad:text-sm border rounded" id={name}>
          <option value="" disabled={true} selected={false}>
            Gender
          </option>
          <option>Nam</option>
          <option>Nữ</option>
          <option>Đồng tính Nam</option>
          <option>Đồng tính nữ</option>
        </select>
      ) : (
        <input
          className="w-full tablet:py-1  tablet:text-sm ipad:py-1  ipad:text-sm px-3 py-2 border rounded shadow appearance-none dark:text-white text-whiteleading-tight focus:outline-none focus:shadow-outline"
          {...props}
          name={name}
          type={type}
        />
      )}
      {errors[name] && touched[name] && <p className="mt-2 text-sm ipad:mt-1 ipad:text-xs ipad:font-semibold tablet:mt-1 tablet:text-xs tablet:font-semibold font-bold text-red-500">{errors[name]}</p>}
    </div>
  );
};

// const FormFieldMobile = ({ label, register, errors, type, name }) => {
//   return (
//     <div className="flex flex-col gap-1 mb-3">
//       <label className="font-medium text-sm" htmlFor={name}>
//         {label}
//       </label>

//       {type === "select" ? (
//         <select className="focus:outline-none w-full py-1 px-2 text-sm border border-[#D9D9D9] border-solid rounded-[10px]" id={name} {...register(name)}>
//           <option>Nam</option>
//           <option>Nữ</option>
//           <option>Đồng tính Nam</option>
//           <option>Đồng tính nữ</option>
//         </select>
//       ) : (
//         <input className="focus:outline-none py-1 px-2 text-sm rounded-[10px] border border-[#D9D9D9] border-solid " type={type} name={name} id={name} {...register(name)} />
//       )}

//       {errors[`${name}`] && <p className="text-sm font-medium text-red-500">{errors[`${name}`].message}</p>}
//     </div>
//   );
// };

const SignupForm = () => {
  const [sta, setSta] = useState(true);
  const [location, setLocation] = useState({
    Latitude: "",
    Longitude: "",
  });
  const navigate = useNavigate();

  const dataForm = [
    {
      id: 1,
      label: "Username",
      name: "Username",
      type: "text",
    },

    {
      id: 2,
      label: "Full Name",
      name: "FullName",
      type: "text",
    },

    {
      id: 3,
      label: "Email",
      name: "Email",
      type: "email",
    },

    {
      id: 4,
      label: "Gender",
      name: "Gender",
      type: "select",
    },

    {
      id: 5,
      label: "Password",
      name: "Password",
      type: "password",
    },

    {
      id: 6,
      label: "Confirm Password",
      name: "Cf_Password",
      type: "password",
    },
  ];

  const getLocation = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          // Vị trí đã được cho phép
          requestGeolocationPermission();
        } else if (permissionStatus.state === "prompt") {
          // Hiển thị cửa sổ xác nhận yêu cầu vị trí
          navigator.geolocation.getCurrentPosition((position) => {
            requestGeolocationPermission();
          }, alert("Vui lòng mở vị trí trước khi tiếp tục!") && setSta(false));
        } else if (permissionStatus.state === "denied") {
          // Vị trí bị từ chối
          alert("Vui lòng mở vị trí trước khi tiếp tục!");
          setSta(false);
        }
      });
    } else {
      alert("Trình duyệt không hỗ trợ geolocation hoặc trình duyệt chặn truy cập vị trí, vui lòng kiểm tra!.");
      setSta(false);
    }
  };

  function requestGeolocationPermission() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            Latitude: latitude,
            Longitude: longitude,
            LastLoginIP: "1",
            avatarLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS9Zde21fi2AnY9_C17tqYi8DO25lRM_yAa7Q&usqp=CAU&fbclid=IwAR16g1ONptpUiKuDIt37LRxU3FTZck1cv9HDywe9VWxWSQBwcuGNfB7JUw4",
          });
          setSta(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.warn("Vui lòng quyền truy cập vị trí trên thiết bị.");
          } else {
            console.error("Lỗi khi truy cập geolocation:", error.message);
          }
          setSta(false);
        }
      );
    } else {
      toast.warn("Trình duyệt không hỗ trợ geolocation.");
      setSta(false);
    }
  }

  useEffect(() => {
    getLocation();

    window.addEventListener("GeolocationPermissionChangeEvent", getLocation);

    return () => {
      window.removeEventListener("GeolocationPermissionChangeEvent", getLocation);
    };
  }, []);

  const handleSubmitForm = async (data, setErrors = () => {}) => {
    console.log(data);
    try {
      const response = await axios.post("https://api.iudi.xyz/api/register", data);
      toast.success("Register successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error registering:", error);
      setErrors({
        Email: error.response.data.message,
      });
      toast.error(`Register failed! ${error.response.data.message}`, {
        closeOnClick: true,
      });
    }
  };

  return (
    <div className="absolute top-6 bottom-6 inset-0 flex items-center justify-center" style={{ background: "rgba(255, 255, 255, .3)" }}>
      <div className="max-w-md tablet:max-w-sm ipad:max-w-sm w-full mx-auto border-2 border-green-400 rounded-[20px] bg-gray-900">
        <Formik
          initialValues={{
            Username: "",
            FullName: "",
            Email: "",
            Gender: "",
            Password: "",
            Cf_Password: "",
          }}
          validationSchema={registerSchema}
          onSubmit={(result, { setErrors }) => {
            handleSubmitForm({ ...result, ...location }, setErrors);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="p-7 tablet:p-5 ipad:p-5 rounded ">
              <h3 className="mt-2 mb-2 text-3xl tablet:text-xl ipad:text-xl font-extrabold text-center text-[#50C759] ">REGISTER</h3>
              {dataForm.map((item) => (
                <FormField key={item.id} label={item.label} name={item.name} type={item.type} errors={errors} touched={touched} onChange={handleChange} onBlur={handleBlur} value={values[item.name]} />
              ))}

              <div className="mb-4 tablet:mb-3">
                {!sta ? (
                  <p>({!sta && "Vui lòng bật quyền truy cập vị trí trên thiết bị."})</p>
                ) : (
                  <button
                    style={{
                      background: "linear-gradient(90deg, rgba(29,120,36,1) 0%, rgba(44,186,55,0.8127626050420168) 90%, rgba(0,255,68,1) 100%)",
                    }}
                    className={`w-full px-3 py-2 font-bold tablet:font-semibold text-lg tablet:text-sm ipad:text-sm ipad:font-semibold  rounded focus:outline-none text-white`}
                    type="submit"
                  >
                    Register
                  </button>
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupForm;
