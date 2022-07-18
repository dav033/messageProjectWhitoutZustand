import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getUsersLessOne } from 'src/petitions'
import useAuth from '@context/auth/useAuth'

export default function Users () {
  const router = useRouter()
  const { userData } = useAuth()

  const [users, setUsers] = useState<any>([])
  useEffect(() => {
    const getUsers = async () => {
      const response = await getUsersLessOne(userData._id)

      console.log(response.users)
      setUsers(response.users)
    }

    getUsers()
  }, [])

  const goChat = (userTarget) => {
    for (let i = 0; i < userData.privateChats.length; i++) {
      for (let j = 0; j < userTarget.privateChats.length; j++) {
        if (userData.privateChats[i] === userTarget.privateChats[j]) {
          router.push({
            pathname: 'chats/[chat]',
            query: { chat: userTarget.privateChats[j] }
          })
          return
        }
      }
    }
    router.push({ pathname: '/chats', query: { data: userTarget._id } })
  }

  return users
    ? (
    <div>
      {users.map((user) => {
        return (
          <h1
            onClick={() => goChat(user)}
            key={user._id}
            style={{
              color: 'white',
              display: 'block',
              margin: '20px'
            }}
          >
            {user.userName}
          </h1>
        )
      })}
    </div>
      )
    : null
}
