import { Link } from 'react-router-dom'
import Moment from 'react-moment'

import { handleErrorImg } from '../../../../service/utils/utils'

import config from '../../../../configs/Configs.json'
const { URL_BASE64 } = config

const MessageHistoryItem = (props) => {
 const {
  Content,
  OtherUsername,
  OtherAvatar,
  MessageTime,
  OtherUserID,
  idParams,
  refImg,
  isOnline,
 } = props.data

 return (
  <li
   style={
    parseInt(idParams) === OtherUserID ? { background: 'rgba(0,0,0,.2)' } : {}
   }
  >
   <Link
    to={`message/${OtherUserID}`}
    state={{
     userName: OtherUsername,
     isOnline,
     avatar: OtherAvatar,
    }}
   >
    <div className='flex items-center justify-between mt-4 cursor-pointer'>
     <div className='flex items-center gap-2'>
      <img
       className=' mx-auto w-[73px] h-[73px] rounded-full object-cover'
       src={`${URL_BASE64}${OtherAvatar}`}
       alt={`avatar ${OtherUsername}`}
       onError={() => handleErrorImg(refImg)}
       ref={refImg}
      />

      <div>
       <h3 className='capitalize'>{OtherUsername}</h3>
       <p className='text-gray-500'>{Content}</p>
      </div>
     </div>

     <div className='flex flex-col items-end'>
      <Moment date={`${MessageTime}+0700`} format='hh:mm A' />
      {isOnline && (
       <span className={`w-[16px] h-[16px] rounded-full bg-[#FFA451]`}></span>
      )}
     </div>
    </div>
   </Link>
  </li>
 )
}

export default MessageHistoryItem