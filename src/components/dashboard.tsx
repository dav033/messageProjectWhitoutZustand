import useAuth from '../context/auth/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from './modal'
import { useShow } from '../hooks/useShow'
import { FaRegUser } from 'react-icons/fa'

import React, { useCallback, useEffect, useState } from 'react'
import ChatDashboard from './chatsDashboard'
import { uploadProfileImage } from '../petitions'
import style from '../styles/Dashboard.module.scss'
import Image from 'next/image'
import File from './file'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useQueryClient } from 'react-query'
import DashboardList from './dashboardList'

function Dashboard () {
  const { isLogged, user, userIsLoading, userData } = useAuth()
  const queryClient = useQueryClient()

  const { show, open, close } = useShow()

  const [overlay, setOverlay] = useState<HTMLElement>(null)
  const [sidebar, setSidebar] = useState<HTMLElement>(null)
  const [loading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    if (user) {
      setOverlay(document.getElementById('overlay'))
      setSidebar(document.getElementById('collapsileSidebar'))
    }
  }, [user])

  const openMenu = useCallback(() => {
    console.log('Owowwowoo')
    console.log(overlay)
    overlay.style.display = 'block'
    sidebar.style.width = '250px'
  }, [overlay, style])

  function closeMenu () {
    overlay.style.display = 'none'
    sidebar.style.width = '0px'
  }

  useEffect(() => {
    if (show) {
      closeMenu()
    }
  }, [show])

  function RenderProfileImage () {
    if (userData) {
      if (userData.profileImage) {
        return (
          <Image
            src={userData.profileImage}
            className={style.userProfileImage}
            alt="profileImage"
            width={'140px'}
            height={'140px'}
          ></Image>
        )
      } else {
        return <FaRegUser className={style.iconProfile} />
      }
    }
  }

  const uploadImage = async () => {
    setLoading(true)
    await uploadProfileImage(user.id, aux)
    setLoading(false)
    queryClient.invalidateQueries('prueba')
    close()
  }

  const [aux, setAux] = useState()

  const funAux = (value) => {
    setAux(value)
  }

  return isLogged() && !userIsLoading && user
    ? (
    <div>
      <Modal show={show} close={close} saveButtonFunction={uploadImage}>
        <File func={funAux} spinnerValue={loading} isTheFatherOpen={show} />
      </Modal>
      <div
        className={style.overlay}
        id="overlay"
        onClick={() => closeMenu()}
      ></div>
      <div className={style.collapsileSidebar} id="collapsileSidebar">
        <div className={style.profileContainer}>
          <div className={style.userProfileImage}>
            <div className={style.overlayProfileImage} onClick={open}></div>

            <RenderProfileImage />
          </div>
          <h2 style={{ marginTop: '5px', color: '#dcdcdd' }}>
            {user.userName}
          </h2>
        </div>
        <DashboardList />
      </div>
      <div className={style.sidebar}>
        <div className={style.sidebarMenu} style={{ paddingTop: '10px' }}>
          <div
            style={{
              backgroundColor: '',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesomeIcon
              className={style.iconMenu}
              icon={faBars}
              onClick={() => openMenu()}
            />

            <input
              type="text"
              placeholder="buscar.."
              className={style.searchInput}
            />
          </div>

          <ChatDashboard />
        </div>
      </div>
    </div>
      )
    : null
}

export default React.memo(Dashboard)
