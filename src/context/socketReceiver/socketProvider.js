import socket from '../../socket'
import useAuth from '../auth/useAuth'
import React, { createContext, useState, useEffect } from 'react'
import { useQueryClient } from 'react-query'
export const SocketContext = createContext()

function SocketProvider ({ children }) {
  const { userIsLoading, user, isLogged } = useAuth()
  const [receivingMessageRoom, setReceivingMessageRoom] = useState(null)
  const [socketId, setSocketId] = useState('')
  const [usersList, setUsersList] = useState([])
  const [receivingMessageDashboard, setReceivingMessageDashboard] =
    useState(null)
  const queryClient = useQueryClient()

  socket.on('usersList', (usersList) => {
    setUsersList(usersList)
  })

  socket.on('message', (message) => {
    if (isLogged() && user !== undefined && user !== null && user.id) {
      if (message.transmitter !== user.id) {
        console.log('transmitter:', message.transmitter, 'user:', user)

        if (message.context === 'provitionalChat') {
          queryClient.invalidateQueries('messageaffect')
        }

        setReceivingMessageRoom(message)
        setReceivingMessageDashboard(message)
      }
    }
  })

  socket.on('refresh', () => {
    queryClient.invalidateQueries('getUser')
    queryClient.invalidateQueries('messageaffect')
  })

  socket.on('identifier', (socketid) => {
    setSocketId(socketid)
  })

  useEffect(() => {
    console.log('SOCKET')
    if (user) {
      const rooms = user.rooms
      const privateChats = user.privateChats
      if (rooms) {
        for (let i = 0; i < rooms.length; i++) {
          socket.emit('joinRoom', rooms[i])
          console.log('uniendose a ', rooms[i])
        }
      }

      if (privateChats) {
        for (let i = 0; i < privateChats.length; i++) {
          socket.emit('joinRoom', privateChats[i])
          console.log('uniendose a chat privado', privateChats[i])
        }
      }
    }
  }, [user, userIsLoading])

  useEffect(() => {
    if (!userIsLoading) {
      socket.connect()
      socket.emit('conectado', user.id)
    }
  }, [userIsLoading])

  const contextValue = {
    receivingMessageRoom,
    socketId,
    usersList,
    setReceivingMessageRoom,
    setReceivingMessageDashboard,
    receivingMessageDashboard
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export default React.memo(SocketProvider)
