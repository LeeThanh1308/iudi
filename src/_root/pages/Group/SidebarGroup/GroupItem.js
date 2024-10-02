import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  handleErrorImgGroup,
  slugString,
} from "../../../../service/utils/utils";

import { MdEdit } from "react-icons/md";
import config from "../../../../configs/Configs.json";
import axios from "axios";
import LazyLoad from "react-lazy-load";
const { URL_BASE64, API__SERVER } = config;

const GroupItem = (props) => {
  const { GroupID, avatarLink, GroupName, idParams } = props.data;

  //  const inputRef = useRef()

  //  const [value, setValue] = useState('')

  //  const handleEditGroup = async () => {
  //   inputRef.current.disabled = false
  //   inputRef.current.focus()
  //  }

  //  const handleChangeValue = (e) => {
  //   setValue(e.target.value)
  //  }

  //  const handleKeyPress = async (e) => {
  //   if (e.code === 'Enter') {
  //    if (value.trim() !== '' && value.trim() !== GroupName) {
  //     const data = {
  //      GroupName: value,
  //     }

  //     try {
  //      const res = await axios.patch(
  //       `${API__SERVER}/forum/group/update_group/${GroupID}`,
  //       data
  //      )

  //      inputRef.current.disabled = true

  //      console.log('change name success')
  //     } catch (error) {
  //      console.log(error)
  //     }
  //    }
  //   }
  //  }

  //  useEffect(() => {
  //   setValue(GroupName)
  //  }, [])

  return (
    <li
      key={GroupID}
      className={`relative mb-3 group w-full hover:bg-[#00000033] rounded-xl p-2 ${
        GroupID === parseInt(idParams) && "bg-[#00000033]"
      }`}
    >
      <Link
        // state={{ avatarLink, groupName: GroupName }}
        to={`/group/${slugString(GroupName)}/${GroupID}`}
        className="flex flex-wrap gap-2 items-center"
      >
        <div>
          <LazyLoad>
            <>
              <img
                alt={GroupName}
                onError={(e) => handleErrorImgGroup(e.target)}
                src={`${avatarLink}`}
                className="w-[60px] h-[60px] ipad:w-[30px] ipad:h-[30px] rounded-full border-2 border-solid border-[#fdfdfd] object-cover"
              />
            </>
          </LazyLoad>
        </div>

        {/* <input
     className='text-[14px] ipad:text-[8px] bg-transparent outline-none'
     type='text'
     value={GroupName}
     disabled
    //  disabled={true}
    //  ref={inputRef}
    //  onChange={handleChangeValue}
    //  onKeyPress={handleKeyPress}
    /> */}

        <h3 className="text-[14px] ipad:text-[8px] bg-transparent outline-none text-white">
          {GroupName}
        </h3>
      </Link>

      {/* <div className='group-hover:flex hidden transition-all absolute right-2 top-1/2 -translate-y-1/2'>
    <button onClick={handleEditGroup} type='button'>
     <MdEdit />
    </button>
   </div> */}
    </li>
  );
};

export default GroupItem;
