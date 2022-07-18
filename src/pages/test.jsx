import useAuth from '@context/auth/useAuth'

import axios from 'axios'

import { QueryClient, useQueryClient } from 'react-query'

import { useMutatePost } from '@hooks/post'
import { createRoom, uploadProfileImage } from '../petitions'

// import { basePath, joinToSocketRoom } from '../helpers'
import { basePath } from '@helpers/basePath'
import joinToSocketRoom from '@helpers/joinToSocketRoom'

import { useState } from 'react'
import { useFile } from '@hooks/useFile'
import useSocket from '../context/socketReceiver/useSocket'

export default function Test () {
  const { user } = useAuth()
  const { usersList } = useSocket()

  const queryClient = useQueryClient()

  const owo = async () => {
    const token = localStorage.getItem('token')
    console.log(`${basePath}users/token`)
    const response = await axios.post(
      `${basePath}users/token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    await console.log(response)
  }

  async function prueba () {
    console.log(usersList)
  }

  function name () {
    console.log(user)
  }
  const createRoomMutate = useMutatePost('messageaffect', createRoom)

  const sendRoom = async (e) => {
    e.preventDefault()
    const { nombreRoom, typeRoom } = e.target.elements

    const roomData = {
      name: nombreRoom.value,
      creator: user.id,
      type: typeRoom.value,
      users: [user.id]
    }

    createRoomMutate.mutate(
      { roomData },
      {
        onSuccess: (response) => {
          nombreRoom.value = ''
          typeRoom.value = 'Publica'
          console.log(response)
          queryClient.invalidateQueries('getUser')
          queryClient.invalidateQueries('messageaffect')

          // joinToSocketRoom(response)
        }
      }
    )
  }
  const [target, setTarget] = useState()
  const { file, fileUrl } = useFile(target)

  const onChangePrueba = (e) => {
    setTarget(e.target.files[0])
  }

  const enviarPrueba = async () => {
    uploadProfileImage(user.id, file)
  }

  return (
    <div className="home" style={{ flex: 4, backgroundColor: '' }}>
      <input type="file" onChange={(e) => onChangePrueba(e)}></input>
      <button onClick={() => enviarPrueba()}>enviar</button>
      <button onClick={(e) => prueba()}>usersList</button>
      <button onClick={(e) => owo()}>token</button>
      <button onClick={(e) => name()}>suario</button>
      <form onSubmit={(e) => sendRoom(e)}>
        <input type="text" placeholder="nombre" id="nombreRoom" input />
        <select id="typeRoom">
          <option value="Publica">Publica</option>
          <option value="Privada">Privada</option>
        </select>
        <button type="submit">crear sala</button>
      </form>

      <img src={fileUrl}></img>
    </div>
  )
}
