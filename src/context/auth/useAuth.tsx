import { useContext } from 'react'
import { AuthContext } from './authProvider'

function useAuth () {
  return useContext(AuthContext)
}

export default useAuth
