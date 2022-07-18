import React from 'react'
// import useAuth from '@context/auth/useAuth'
import { getMessagesByRoomId } from '../../petitions'
import { useQuery } from 'react-query'
import BaseRoom from '@components/baseRoom'
import { useRouter } from 'next/router'

function Room () {
  const router = useRouter()

  const { data: messages } = useQuery(
    ['messageAffect', router.query.room],
    () => getMessagesByRoomId(router.query.room.toString()),
    {
      keepPreviousData: true,
      enabled: router.query.room.toString() !== undefined,
      refetchOnWindowFocus: false
    }
  )

  return messages
    ? (
    <BaseRoom
      messages={messages}
      roomId={router.query.room.toString()}
      context="room"
    />
      )
    : null
}

export default React.memo(Room)
