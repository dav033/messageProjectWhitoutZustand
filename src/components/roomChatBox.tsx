/* eslint-disable react/prop-types */
import useAuth from '@context/auth/useAuth'
import style from '../styles/ChatsDashboard.module.scss'
import { useRouter } from 'next/router'
import React from 'react'
import { motion } from 'framer-motion'
const variant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
}
function RoomChatBox ({
  chat,
  RenderLastMessages,
  renderDate,
  userId,
  privateChatInfo
}) {
  const router = useRouter()
  const { setCambio } = useAuth()

  function RenderChatName () {
    if (chat.room.type) {
      return chat.room.name
    } else {
      let aux = ''
      console.log(privateChatInfo)

      privateChatInfo.forEach((privChat) => {
        if (privChat.chatId === chat.room._id) {
          aux = privChat.userName
        }
      })
      return aux
    }
  }
  return (
    <div
      className={style.friendDrawer}
      // layoutId="123"
      onClick={() => {
        if (chat.room.type) {
          setCambio(chat.room._id)

          router.push({
            pathname: '/rooms/[room]',
            query: { room: chat.room._id }
          })
        } else {
          setCambio(chat.room._id)

          router.push({
            pathname: '/chats/[chat]',
            query: { chat: chat.room._id }
          })
        }
      }}
    >
      <img
        className={style.profileImage}
        src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
        alt=""
      />
      <div className={style.text}>
        <h6>{RenderChatName()}</h6>
        <p className="text-mute d"> {RenderLastMessages(chat.lastMessage)}</p>
      </div>
      <span className="time text-muted small">{renderDate(chat)}</span>
    </div>
  )
}

export default React.memo(RoomChatBox)
