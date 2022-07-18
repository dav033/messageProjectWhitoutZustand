import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../context/auth/useAuth'
import {
  getUserById,
  getChatsByIdGroup,
  getPrivatesChatsByidGroup
} from '../petitions'
import { useQuery } from 'react-query'
import { transformDate } from '@helpers/transformDate'

import RoomChatBox from './roomChatBox'
import useSocket from '@context/context/useAplicationContext'
import { LayoutGroup, motion } from 'framer-motion'
const variant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } }
}
function ChatDashboard () {
  const { isLogged, userData, messageAux, user } = useAuth()
  const { receivingMessageDashboard, setReceivingMessageDashboard } =
    useSocket()
  const [useAux, setUseAux] = useState([])
  const [chatsAux, setChatsAux] = useState([])
  const [privateChatsAux, setPrivateChatsAux] = useState([])
  const { data: chats } = useQuery(
    ['messageaffect', 'getChatBoxes', userData],
    () => getChatsByIdGroup(userData.rooms),
    {
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
      enabled: userData !== null && userData !== undefined
    }
  )

  const chatBox = useRef()

  useEffect(() => {
    if (chats) {
      setChatsAux(chats)
    }
  }, [chats])

  const { data: privateChats } = useQuery(
    ['messageaffect', 'getPrivateChats', userData],
    () => getPrivatesChatsByidGroup(userData.privateChats),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      enabled: userData !== null && userData !== undefined
    }
  )

  useEffect(() => {
    if (useAux !== undefined) {
      chatBox.current = useAux
      console.log(chatBox.current)
    }
  }, [useAux])

  useEffect(() => {
    if (privateChats) {
      const prueba = async () => {
        const privateChatsUsersInfo = []

        for (let i = 0; i < privateChats.length; i++) {
          let otherUser = ''
          if (privateChats[i].room.user1 === userData._id) {
            otherUser = privateChats[i].room.user2
          } else {
            otherUser = privateChats[i].room.user1
          }

          const userInfo = await getUserById(otherUser)
          privateChatsUsersInfo.push({
            chatId: privateChats[i].room._id,
            userName: userInfo.userName
          })

          setPrivateChatsAux(privateChatsUsersInfo)
        }
      }

      prueba()
    }
  }, [privateChats, userData])

  useEffect(() => {
    if (chatsAux && chatsAux !== null && chatsAux !== undefined) {
      let trueChats = []

      trueChats = chatsAux.concat(privateChats)

      const chatsWhitMessages = []
      trueChats.forEach((chat) => {
        if (chat) {
          if (chat.lenghtMessages !== 0) {
            chatsWhitMessages.push(chat)
          }
        }
      })

      const chatsWhitoutMessages = []
      chatsAux.forEach((chat) => {
        if (chat.lenghtMessages === 0) {
          chatsWhitoutMessages.push(chat)
        }
      })

      const Aux2 = chatsWhitMessages.concat(chatsWhitoutMessages)

      Aux2.sort((a, b) => {
        if (
          a.lastMessage !== null &&
          b.lastMessage !== null &&
          a.lastMessage !== undefined &&
          b.lastMessage !== undefined
        ) {
          const dateA: any = new Date(a.lastMessage.createdAt)
          const dateB: any = new Date(b.lastMessage.createdAt)
          return dateB - dateA
        } else {
          return null
        }
      })

      const components = []
      Aux2.forEach((chat) => {
        components.push(
          <RoomChatBox
            key={chat._id}
            chat={chat}
            RenderLastMessages={RenderLastMessages}
            renderDate={renderDate}
            userId={user.id}
            privateChatInfo={privateChatsAux}
          />
        )
      })

      setUseAux(components)
    }
  }, [userData, privateChatsAux, chatsAux, chats])

  useEffect(() => {
    if (useAux) {
      // if (messageAux) {
      //   console.log(messageAux)
      // }

      // if (receivingMessageDashboard) {
      //   console.log(receivingMessageDashboard)
      // }

      if (messageAux !== null && messageAux !== undefined) {
        setUseAux(() => {
          let owo: any = 'q3q'
          if (messageAux !== null && messageAux !== undefined) {
            useAux.forEach((chat) => {
              if (chat.props.chat.room._id === messageAux.room) {
                return (chat.props.chat.lastMessage = messageAux)
              }
            })

            owo = useAux.find(
              (chat) => chat.props.chat.room._id === messageAux.room
            )

            const ewe = useAux.indexOf(owo)

            const mensajeEnviado = useAux[ewe]
            const aux = useAux.slice(0, ewe)
            const mama = useAux.slice()
            mama.splice(0, ewe + 1)

            aux.unshift(mensajeEnviado)
            mama.unshift(...aux)

            return mama
          }

          if (receivingMessageDashboard !== null) {
            useAux.forEach((chat) => {
              if (chat.props.chat.room._id === receivingMessageDashboard.room) {
                chat.props.chat.lastMessage = receivingMessageDashboard
              }
            })
            setReceivingMessageDashboard(null)
          }
        })
      }

      if (receivingMessageDashboard !== null) {
        useAux.forEach((chat) => {
          if (chat.props.chat.room._id === receivingMessageDashboard.room) {
            chat.props.chat.lastMessage = receivingMessageDashboard
          }
        })
        setReceivingMessageDashboard(null)
      }

      // setMessageAux(null)
    }
  }, [messageAux, receivingMessageDashboard])

  const RenderLastMessages = (lastMessage) => {
    if (lastMessage != null) {
      return lastMessage.content
    } else {
      return 'No hay mensajes'
    }
  }

  const renderDate = (data) => {
    if (data) {
      if (data.lastMessage != null) {
        const messageDate = data.lastMessage.createdAt
        const dateTransform = transformDate(messageDate)
        const { time } = dateTransform

        return time
      } else {
        return null
      }
    } else {
      return 'h2'
    }
  }

  function Main () {
    if (isLogged() && useAux) {
      if (
        useAux &&
        useAux.length !== 0 &&
        useAux != null &&
        useAux !== undefined
      ) {
        return (
          <LayoutGroup
            style={{ width: '100%', height: '100%', margin: '0', padding: '0' }}
          >
            {useAux.map((chat) => chat)}
          </LayoutGroup>
        )
      } else {
        return <>No hay chats</>
      }
    } else {
      return <>no hay chatsaa</>
    }
  }

  return isLogged() ? <Main /> : null
}

// export async function getServerSideProps () {
//   const responseRooms = getRooms()
// }

export default React.memo(ChatDashboard)
