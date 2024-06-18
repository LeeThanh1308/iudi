import { Link } from 'react-router-dom'

import { handleErrorImg } from '../../../../service/utils/utils'
import config from '../../../../configs/Configs.json'

const { URL_BASE64 } = config

const UserOtherItem = (props) => {
 const { id, username, avatar, refImg } = props.data

 return (
  <div className='text-center'>
   <Link
    to={`/message/${id}`}
    state={{
     userName: username,
     isOnline: true,
     avatar: avatar,
    }}
   >
    <img
     className=' mx-auto w-[73px] h-[73px] tablet:w-[60px] tablet:h-[60px] mobile:w-[50px] mobile:h-[50px] rounded-full object-cover'
     src={`${URL_BASE64}${avatar}`}
     alt='avatar'
     ref={refImg}
     onError={() => handleErrorImg(refImg)}
    />
    <h5 className='capitalize'> {username}</h5>
   </Link>
  </div>
 )
}

export default UserOtherItem
