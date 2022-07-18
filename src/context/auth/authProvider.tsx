import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import socket from '../../socket'
import { basePath } from '@helpers/basePath'
import {
  verifyToken,
  getUserById,
  loginP,
  revalidateUserData
} from '../../petitions'
import { useQuery, useQueryClient } from 'react-query'
import { useMutatePost } from '@hooks/post'

export const AuthContext = createContext(null)

function AuthProvider ({ children }) {
  const [chatAux, setChatAux] = useState()
  const [messageAux, setMessageAux] = useState()

  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('token')
      const initialValueToken = token || ''
      return initialValueToken
    } else {
      return null
    }
  })
  const queryClient = useQueryClient()
  interface User {
    id: string
    profileImage?: string
    rooms: string[]
    socketId?: string
    token: string
    userName: string
  }
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [election, setElection] = useState('chat')
  const [updatingRoom, setUpdatingRoom] = useState(false)
  const [userIsLoading, setUserIsLoading] = useState(false)
  const [cambio, setCambio] = useState('')
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      console.log('wiqwdineieni')
      setUserIsLoading(true)
      const user = window.localStorage.getItem('user')
      const initialValueUser = user ? JSON.parse(user) : ''
      setUserIsLoading(false)
      return initialValueUser
    } else {
      return null
    }
  })

  const [userIsChanged, setUserIsChanged] = useState(false)

  const getUser = async () => {
    // const token = window.localStorage.getItem("token");
    if (typeof window !== 'undefined') {
      setUserIsLoading(true)
      const response = await revalidateUserData(user.id)
      console.log(response)
      setUser(response)
      window.localStorage.setItem('user', JSON.stringify(response))
      setUserIsLoading(false)
    } else {
      return null
    }
  }
  const isLogged = () => !!user

  const [userIsDoingSomething, setUserIsDoingSomething] =
    useState<boolean>(false)

  const userDoing = () => {
    setUserIsDoingSomething(true)
    setTimeout(() => setUserIsDoingSomething(false), 500)
  }

  const userChange = () => {
    console.log('user change')
    setUserIsChanged(true)
    setTimeout(function () {
      setUserIsChanged(false)
    }, 5000)
  }

  useEffect(() => {
    if (userIsChanged === true) {
      getUser()
    }
  }, [userIsChanged])

  useEffect(() => {
    const verifyTokenFunction = async () => {
      const token = window.localStorage.getItem('token')
      const response = await verifyToken(token)
      if (response.message === 'Token invalido') {
        window.localStorage.removeItem('token')
        setToken('')
      } else {
        setUser(response.user)
      }
    }

    if (userIsDoingSomething) {
      verifyTokenFunction()
    }
  }, [userIsDoingSomething])

  const { data: userData, isFetching: isLoadingUserData } = useQuery(
    ['getUser', user],
    () => getUserById(user.id),
    {
      enabled: isLogged(),
      refetchOnWindowFocus: false,
      onSuccess: (data) => console.log(data)
    }
  )
  useEffect(() => {
    interface tokenObject {
      message: string
      user: {
        id: string
        userName: string
        email: string
        token: string
        rooms: Array<string>
        profileIMage: string
        privateChats: Array<string>
      }
    }
    const verify = async () => {
      const tokenV: tokenObject = await verifyToken(token)
      if (tokenV.message === 'Token inválido') {
        window.localStorage.removeItem('token')
        setToken('')
        logout()
      }
    }

    verify()

    if (token === '') {
      logout()
    }
  }, [])
  // : {
  //   id: string
  //   user: string
  //   token: string
  //   rooms?: string[]
  //   profileImage?: string
  //   message: string
  function userInit (args) {
    console.log(args)
    const { id, user, token, rooms, profileImage, privateChats } = args.user

    setUserIsLoading(true)

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

    setUser(userObj)

    window.localStorage.setItem('token', token)
    window.localStorage.setItem('user', JSON.stringify(userObj))
    setUserIsLoading(false)
  }

  const loginMutate: any = useMutatePost('login', loginP)

  const login = (
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
            userInit(data)
          } else if (data.message === 'Usuario no encontrado') {
            alert('Este usuario no existe')
          } else if (data.message === 'Contraseña incorrecta') {
            alert('Contraseña incorrecta')
          }
        }
      }
    )
  }

  const register = async (props) => {
    const response = await axios.post(`${basePath}users/register`, props)
    console.log(response)
    const functionArgs = {
      message: response.data.message,
      id: response.data.id,
      user: response.data.user,
      token: response.data.token
    }

    if (response.data.message === 'Usuario registrado') {
      userInit(functionArgs)
    } else if (response.data.message === 'Usuario ya existe') {
      alert('Este usuario ya existe')
    } else if (response.data.message === 'Por favor llene todos los campos') {
      alert('Por favor llene todos los campos')
    }
  }

  const logout = () => {
    setUser(null)
    socket.disconnect()
    socket.emit('desconectado')
    window.localStorage.removeItem('token')
    window.localStorage.removeItem('user')
    queryClient.invalidateQueries()
  }

  const contextValue = {
    user,
    setUser,
    login,
    register,
    logout,
    isLogged,
    getUser,
    updatingRoom,
    setUpdatingRoom,
    election,
    setElection,
    userIsLoading,
    cambio,
    setCambio,
    userData,
    creatingRoom,
    setCreatingRoom,
    isLoadingUserData,
    userDoing,
    chatAux,
    setChatAux,
    userChange,
    messageAux,
    setMessageAux
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
