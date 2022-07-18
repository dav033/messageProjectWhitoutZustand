import { getSocketIdByUserId } from '@helpers/getSockedId'
import { useMutation, useQueryClient } from 'react-query'
import { sendMessage } from 'src/petitions'
import socket from 'src/socket'
import useSocket from '@context/context/useAplicationContext'
import { useRouter } from 'next/router'

export default function useSocketMessage (args) {
  //   const queryClient = useQueryClient()
  const { usersList } = useSocket()
  const router = useRouter()
  const { context, receiver } = args
  return useMutation(sendMessage, {
    onSuccess: (data) => {
      console.log(data)
      if (context === 'room') {
        socket.emit('sendMessageToRoom', data)
      } else if (context === 'provitionalChat' || context === 'privateChat') {
        if (context === 'provitionalChat') {
          //   queryClient.invalidateQueries('getUser')
          //   queryClient.invalidateQueries('messageaffect')
          socket.emit('joinRoom', data._id)
          const receiverS = getSocketIdByUserId(receiver, usersList)
          socket.emit('refreshReceiver', receiverS)
          router.push(
            {
              pathname: '/chats/[chat]',
              query: { chat: data.room, message: JSON.stringify(data) }
            },
            '/chat'
          )
        }
        socket.emit('sendMessageToRoom', data)
      }
    }
  })
}
