import style from '../styles/RoomListItem.module.scss'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { FaUsers } from 'react-icons/fa'

import { RiGroup2Fill } from 'react-icons/ri'
interface Props {
  name: string
  joinFunction: any
  roomId: string
  image: string
}
export default function RoomListItem (props: Props) {
  function RenderRoomImage () {
    return image != null || undefined
      ? (
      <Image
        width={80}
        height={80}
        src={image}
        alt="roomImage"
        className={style.roomImage}
      />
        )
      : (
      <RiGroup2Fill className={style.AS} />
        )
  }
  const { name, joinFunction, roomId, image } = props
  return (
    <div className={style.roomListItem}>
      <div className={style.imageContainer}>
        <RenderRoomImage />
      </div>

      <div className={style.nameContainer}>
        {' '}
        <h3>{name}</h3>
      </div>
      <div className={style.roomInformation}>
        <div className={style.usersNumber}>
          <b>0</b>
          <FontAwesomeIcon className="icon" icon={faUser} />
        </div>
        <FontAwesomeIcon icon={faLock} className={style.typeRoom} />
      </div>

      <div className={style.buttonContainer}>
        <button onClick={() => joinFunction(roomId)}>Unirse</button>
      </div>
    </div>
  )
}
