import React, { FormEvent, useEffect, useState, useCallback } from 'react'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAuth from '../context/auth/useAuth'
import style from '../styles/BaseRoom.module.scss'
import { getRoomById } from '../petitions'
import RenderMessages from './RenderMessages'
import TextArea from './textArea'
import useSocket from '@context/context/useAplicationContext'

interface Props {
  messages?: Array<{
    type: string
    content: string
    transmitter?: string
    context: string
    room?: string
    createdAt: Date
  }>
  roomId?: string
  context?: string
  receiver?: string
}
function BaseRoom (props: Props) {
  console.log('render')
  const { messages, roomId, context, receiver } = props

  const [messagesState, setMessagesState] = useState<any>([])

  const { receivingMessageRoom, setReceivingMessageRoom } = useSocket()

  useEffect(() => {
    setMessagesState(messages)
  }, [roomId, messages])

  interface Room {
    name: string
    image?: string
    creator: string
    users: string[]
    messages: string[]
    createdAt: Date
    type: string
  }

  const [roomInfo, setRoomInfo] = useState<Room>()
  const { user, setMessageAux } = useAuth()

  useEffect(() => {
    if (context === 'room') {
      const getRoom = async () => {
        const response = await getRoomById(roomId)
        setRoomInfo(response)
      }

      getRoom()
    }
  }, [roomId])

  useEffect(() => {
    if (receivingMessageRoom !== null) {
      if (receivingMessageRoom.room === roomId) {
        setMessagesState([...messagesState, receivingMessageRoom])
      }
    }

    setReceivingMessageRoom(null)

    // setReceivingMessage(null)
  }, [receivingMessageRoom])

  const handleSendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      console.time()
      e.preventDefault()
      const textArea = document.getElementById('message') as HTMLTextAreaElement
      const content = textArea.value
      textArea.value = ''
      document.getElementById('prueba').style.display = 'none'

      const time = new Date(Date.now()).toISOString()

      let messageObject: any = {}
      if (context === 'room') {
        messageObject = {
          type: 'text',
          content,
          transmitter: user.id,
          context,
          room: roomId,
          createdAt: time,
          toSend: true,
          receiver
        }

        setMessagesState([...messagesState, messageObject])
        setMessageAux(messageObject)
      } else if (context === 'provitionalChat') {
        messageObject = {
          type: 'text',
          content,
          transmitter: user.id,
          context,
          receiver,
          createdAt: time,
          toSend: true
        }
        console.log(messageObject)

        setMessagesState([messageObject])
      } else if (context === 'privateChat') {
        messageObject = {
          type: 'text',
          content,
          transmitter: user.id,
          receiver,
          context,
          room: roomId,
          createdAt: time,
          toSend: true
        }

        setMessagesState([...messagesState, messageObject])
        setMessageAux(messageObject)
      }
    },
    [messagesState]
  )

  return (
    <div className={style.seccionChat} style={{ height: '100%' }}>
      <div className={style.usuarioSeleccionado}>
        <div className={style.avatar}>
          <img src="ruta_img" alt="img" />
        </div>
        <div className={style.cuerpo}>
          {context === 'room' && roomInfo
            ? (
            <span style={{ color: 'white' }}>{roomInfo.name}</span>
              )
            : null}
          {/* <span>Activo - Escribiendo...</span> */}
        </div>
        <div className={style.opciones}>
          <ul>
            <li>
              <button type="button">
                <i className="fas fa-video" />
              </button>
            </li>
            <li>
              <button type="button">
                <i className="fas fa-phone-alt" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <RenderMessages messages={messagesState} />

      <form
        className={style.textarea}
        onSubmit={(e) => handleSendMessage(e)}
        id="messageForm"
      >
        <TextArea handleSendMessage={handleSendMessage} />
        <div className={style.buttonContainer} id="prueba">
          <button type="submit" className={style.enviar} id="sendButton">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(BaseRoom)
