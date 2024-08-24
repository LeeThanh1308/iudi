import axios from "axios";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Footer from "../../../components/Footer/Footer";
import config from "../../../configs/Configs.json";
import bg from "../../../images/bg3.jpg";
import { Auth } from "../../../service/utils/auth";
import UserList from "./UserList";

import Header1 from "../../../components/Header/Header1";

import {
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import FindingInfo from "./FindingInfo";

const { FINDING_DEFAULT } = config;

function Finding() {
  const { userID } = new Auth();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const setting = JSON.parse(localStorage.getItem("findingSetting"));

  useEffect(() => {
    handleGetUsers(setting, page);
  }, [page]);

  const handleGetUsers = async (set, nextStep = 1) => {
    const res = await axios.get(
      `https://api.iudi.xyz/api/location/${userID}/${
        set?.radius * 1000 || FINDING_DEFAULT
      }?page=${nextStep}`
    );

    const data = res.data.Distances;

    if (users.length > 0) {
      const dataFilter = data.filter((user) => {
        const userAge =
          new Date().getFullYear() - new Date(user.BirthDate).getFullYear();

        const isAgeMatch = userAge >= parseInt(setting.minAge);
        const isSexMatch = user.Gender === setting.gender;

        return isAgeMatch && isSexMatch;
      });

      return setUsers(dataFilter);
    }
    return setUsers(data);
  };

  const background = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };

  return (
    <>
      <div style={background} className="mobile:hidden">
        <Header1 />
        <div className="relative">
          <div className="px-[40px]">
            <UserList users={users.sort((a, b) => a.Distance - b.Distance)} />
          </div>
        </div>
        <Footer />
      </div>

      <div className="hidden mobile:block">
        <div className="hidden mobile:flex justify-between p-4 items-center border-b-[#817C7C] border-b border-solid">
          <Link to="/">
            <button className="w-8 h-8 ">
              <ChevronLeftIcon />
            </button>
          </Link>
          <span className="text-[22px] font-bold">Tìm quanh đây</span>
          <div className="rounded-full bg-[#008748] w-10 h-10 p-1">
            <AdjustmentsHorizontalIcon className="text-white" />
          </div>
        </div>

        <FindingInfo />
      </div>
    </>
  );
}

export default Finding;
