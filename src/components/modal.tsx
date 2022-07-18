/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from '../styles/Modal.module.scss'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
function Modal ({ show, close, children, saveButtonFunction }) {
  useEffect(() => {
    const modalContainer = document.getElementById('modal_container')
    if (show) {
      console.log('show')
      modalContainer.classList.add(style.show)
    } else {
      modalContainer.classList.remove(style.show)
    }
  }, [show])

  return (
    <div id="modal_container" className={style.modalContainer}>
      <div className={style.modal}>
        <FontAwesomeIcon
          icon={faXmark}
          className={style.closeIcon}
          onClick={close}
        />

        <div
          className={style.children}
          style={{ width: '100%', minHeight: '200px' }}
        >
          {children}
        </div>

        <div className={style.buttonsContainer}>
          <button className={style.modalButton} id="close">
            Cerrar
          </button>
          <button
            className={style.modalButton}
            id="save"
            onClick={saveButtonFunction}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Modal)
