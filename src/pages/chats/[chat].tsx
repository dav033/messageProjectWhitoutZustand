import useAuth from '@context/auth/useAuth'
import { useQuery } from 'react-query'
import BaseRoom from '@components/baseRoom'
import { getMessagesByChatId, getOtherUserByChatId } from '../../petitions'
import { useRouter } from 'next/router'
import React from 'react'

function PrivateChat () {
  const router = useRouter()
  const { user, isLogged } = useAuth()

  const { data: other } = useQuery(
    ['otherUser', router.query.chat],
    () => getOtherUserByChatId(router.query.chat, user.id),
    {
      enabled:
        user != null &&
        router.query.chat != null &&
        router.query.chat !== undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  )

  const { data: messages } = useQuery(
    ['prueba', router.query.chat],
    () => getMessagesByChatId(router.query.chat.toString()),
    {
      initialData: () => {
        if (router.query.message) {
          const owo: any = [JSON.parse(router.query.message.toString())]
          console.log(owo)
          return owo
        }
      },
      keepPreviousData: true,
      enabled: router.query.chat != null && router.query.chat !== undefined,
      refetchOnWindowFocus: false
    }
  )

  return isLogged()
    ? (
    <BaseRoom
      context="privateChat"
      messages={messages}
      roomId={router.query.chat.toString()}
      receiver={other}
    />
      )
    : null
}

export default React.memo(PrivateChat)
