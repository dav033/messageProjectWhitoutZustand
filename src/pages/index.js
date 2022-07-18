// import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useAuth from '@context/auth/useAuth'
import Link from 'next/link'
export default function Home () {
  const { user, logout } = useAuth()
  return (
    <>
      <div className={styles.container}>
        <button onClick={() => console.log(user)}>IsLogged</button>
        <button onClick={logout}>cerrar</button>
        <Link href="/login">
          <a>LOGIN</a>
        </Link>
      </div>
      s ;
    </>
  )
}
