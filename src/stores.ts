import { basePath } from '@helpers/basePath'
import { useMutatePost } from '@hooks/post'
import axios from 'axios'
import { useQueryClient } from 'react-query'
import create from 'zustand'
import { loginP } from './petitions'
import socket from './socket'

function userInit (args) {
  console.log(args)
  const { id, user, token, rooms, profileImage, privateChats } = args.user

  const socketId = ''
  socket.connect()
  socket.emit('conectado', id)

  const userObj = {
    id,
    userName: user,
    token,
    socketId,
    rooms,
    profileImage,
    privateChats
  }
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(userObj))

  return userObj
}

const loginMutate: any = useMutatePost('login', loginP)
const queryClient = useQueryClient()
export const useUser = create((set) => ({
  user: null,

  login: (
    userCredentialsUserName: string,
    usersCredentialsPassword: string
  ) => {
    loginMutate.mutate(
      {
        userName: userCredentialsUserName,
        password: usersCredentialsPassword
      },
      {
        onSuccess: (data: {
          id: string
          user: string
          token: string
          rooms: string[]
          profileImage: string
          privateChats: string[]
          message: string
        }) => {
          if (data.message === 'Usuario autenticado') {
            set({ user: userInit(data) })
          } else if (data.message === 'Usuario no encontrado') {
            alert('Este usuario no existe')
          } else if (data.message === 'Contraseña incorrecta') {
            alert('Contraseña incorrecta')
          }
        }
      }
    )
  },

  register: async (props) => {
    const response = await axios.post(`${basePath}users/register`, props)
    console.log(response)
    const functionArgs = {
      message: response.data.message,
      id: response.data.id,
      user: response.data.user,
      token: response.data.token
    }

    if (response.data.message === 'Usuario registrado') {
      set({ user: userInit(functionArgs) })
    } else if (response.data.message === 'Usuario ya existe') {
      alert('Este usuario ya existe')
    } else if (response.data.message === 'Por favor llene todos los campos') {
      alert('Por favor llene todos los campos')
    }
  },

  logout: () => {
    set({ user: null })
    socket.disconnect()
    socket.emit('desconectado')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user')
    queryClient.invalidateQueries()
  }
}))
