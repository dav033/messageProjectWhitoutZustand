import style from '../styles/Message.module.scss'
import React, { useEffect, useRef } from 'react'
// import { useQueryClient } from 'react-query'
import useSocketMessage from '@hooks/useSocketMessage'

interface Props {
  type: string
  propsObject: {
    content: string
    time: string
    date: string
    dateAux2: string
    context: string
    roomId?: string
    receiver?: string
    transmitter: string
    toSend: boolean
  }
}
function SentMessage (props: Props) {
  // const queryClient = useQueryClient()
  const { propsObject } = props
  const {
    content,
    time,
    date,
    dateAux2,
    context,
    roomId,
    receiver,
    transmitter,
    toSend
  } = propsObject
  const dateLessYear = `${date.split(' ')[0]} ${date.split(' ')[1]}`

  const owo = useRef<Boolean>(true)

  const ewe: any = useSocketMessage({ context, transmitter, receiver })

  useEffect(() => {
    if (toSend === true && owo.current === true) {
      owo.current = false

      const handleSendMessage = async () => {
        console.log('ENviando mensaje')
        const time = new Date(Date.now()).toISOString()

        let messageObject: any = {}
        if (context === 'room') {
          messageObject = {
            type: 'text',
            content,
            transmitter,
            context,
            room: roomId,
            createdAt: time
          }
        } else if (context === 'provitionalChat') {
          messageObject = {
            type: 'text',
            content,
            transmitter,
            context,
            receiver,
            createdAt: time
          }
        } else if (context === 'privateChat') {
          messageObject = {
            type: 'text',
            content,
            transmitter,
            receiver,
            context,
            room: roomId,
            createdAt: time
          }
        }

        //  queryClient.invalidateQueries('messageAffect')

        ewe.mutate({ messageObject })
      }

      handleSendMessage()
    }
  }, [])

  function DateAdviser () {
    if (date !== dateAux2) {
      return (
        <h1 className={style.date}>
          <b
            style={{
              backgroundColor: '#393E46',
              paddingTop: '7px',
              paddingBottom: '7px',
              paddingLeft: '10px',
              paddingRight: '10px',
              borderRadius: '20px',
              opacity: ''
            }}
          >
            {dateLessYear}
          </b>
        </h1>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <DateAdviser />
      <div className={style.mensaje} id={style.left}>
        {/* <div className={style.avatar}>
            <img src="ruta_img" alt="mg" />
          </div> */}
        <div className={style.cuerpo}>
          <div className={style.texto}>{content}</div>
          <span className={style.tiempo} style={{ backgroundColor: '' }}>
            <i className="far fa-clock"></i>
            {time}
          </span>
          <ul className={style.opcionesMsj}>
            <li>
              <button type="button">
                <i className="fas fa-times"></i>
              </button>
            </li>
            <li>
              <button type="button">
                <i className="fas fa-share-square"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default React.memo(SentMessage)
