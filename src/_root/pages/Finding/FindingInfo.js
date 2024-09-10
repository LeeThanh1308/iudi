import { MapPinIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../configs/Configs.json";
import { Auth } from "../../../service/utils/auth";
import { handleErrorImg } from "../../../service/utils/utils";

const { URL_BASE64 } = config;

const listSex2 = ["Giới tính thứ ba", "Đồng tính nam", "Đồng tính nữ"];

const FindingInfo = () => {
  const date = new Date();
  const yearNow = date.getFullYear();

  const { userName, userID } = new Auth();

  const [profileData, setProfileData] = useState({});
  const [citys, setCitys] = useState([]);
  const [selectCity, setSelectCity] = useState("Hà Nội");
  const [distance, setDistance] = useState(0);
  const [age, setAge] = useState(0);
  const [sex2, setSex2] = useState("Giới tính thứ ba");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `https://api.iudi.xyz/api/profile/${userName}`
        );
        setProfileData(response.data.Users[0]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userName]);

  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => setCitys(res.data.data))
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const distanceConvert = distance * 1000;

    try {
      const res = await axios.get(
        `https://api.iudi.xyz/api/location/${userID}/${distanceConvert}`
      );

      const data = res.data.Distances;

      const dataFilter = data.filter((user) => {
        const userAge = yearNow - new Date(user.BirthDate).getFullYear();

        const isAgeMatch = userAge >= parseInt(age);
        const isCityMatch = user.CurrentAdd === selectCity;
        const isSexMatch = user.Gender === sex2;
        return isAgeMatch && isCityMatch && isSexMatch;
      });

      setTimeout(() => {
        navigate("/finding/result", { state: { users: dataFilter } });
      }, 500);
    } catch (error) {
      //  console.log(error)
    }
  };

  const { avatarLink, FullName, BirthDate } = profileData;

  const birthDate = new Date(BirthDate);

  return (
    <>
      {/* Mobile */}
      <div className="hidden mobile:block">
        <div className="flex justify-between items-center border-b border-gray-500 mt-12 mx-5 pb-3">
          <Link to={`/profile/${userName}`}>
            <div className="flex">
              <div className="mx-2">
                <img
                  className="mx-auto w-[60px] h-[60px] rounded-full object-cover border border-slate-900"
                  src={`${URL_BASE64}${avatarLink}`}
                  alt={`avatar ${FullName}`}
                  onError={(e) => handleErrorImg(e.target)}
                />
              </div>

              <div>
                <span className="font-extrabold">{FullName}</span>
                <p className="">
                  {BirthDate === null
                    ? ""
                    : `${yearNow - birthDate.getFullYear()} tuổi`}
                </p>
              </div>
            </div>
          </Link>

          <div>
            <MapPinIcon className="text-[#008748] w-6" />
            <span>3km</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mx-5 mt-5">
            <hr className="w-8 h-[1px] mx-auto border-0 bg-current mb-3" />
            <span className="text-[20px] font-bold">Filter</span>

            <hr className="w-full h-[1px] mx-auto border-0 bg-gray-500 my-4" />

            <div className="flex flex-col p-3 border border-[#008748] rounded-xl">
              <label className="text-[#008748]" htmlFor="city">
                Quê quán
              </label>
              <select
                id="city"
                value={selectCity}
                onChange={(e) => setSelectCity(e.target.value)}
                className="outline-none font-bold"
              >
                {citys.map((city, index) => (
                  <option
                    className="text-[12px] w-10"
                    key={index}
                    value={city.name}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8">
              <span className="text-black font-bold">Khoảng cách</span>
              <input
                type="range"
                min={0}
                max={100}
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="my-4 range range-success range-xs range-infor"
              />
              <div className="flex justify-between">
                <span className="text-black font-bold text-[20px]">0 km</span>
                <span className="font-bold text-black text-[20px]">
                  {distance} km
                </span>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-black font-bold">Độ tuổi</span>
              <input
                type="range"
                min={0}
                max={50}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="my-4 range range-success range-xs range-infor"
              />
              <div className="flex justify-between">
                <span className="text-black font-bold text-[20px]">0</span>
                <span className="font-bold text-black text-[20px]">{age}</span>
              </div>
            </div>

            <div className="mt-12">
              <span className="text-black font-bold">Giới tính</span>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setSex2("Nam")}
                  className="border border-[#008748] font-bold py-2 px-5 rounded-lg hover:bg-[#008748] hover:text-white"
                >
                  Nam
                </button>
                <button
                  type="button"
                  onClick={() => setSex2("Nữ")}
                  className="border border-[#008748] font-bold py-2 px-5 rounded-lg hover:bg-[#008748] hover:text-white"
                >
                  Nữ
                </button>
                <select
                  id="sex"
                  value={sex2}
                  onChange={(e) => setSex2(e.target.value)}
                  className="px-2 outline-none font-bold border border-current rounded-lg"
                >
                  {listSex2.map((sex, index) => (
                    <option
                      className="text-[12px] w-10"
                      key={index}
                      value={sex}
                    >
                      {sex}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Link to="/">
                <button className="border border-[#008748] font-bold py-3 px-5 rounded-lg text-[20px]">
                  Quay lại
                </button>
              </Link>
              <button
                type="submit"
                className="bg-[#008748] text-white font-bold py-3 px-5 rounded-lg text-[20px]"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FindingInfo;
