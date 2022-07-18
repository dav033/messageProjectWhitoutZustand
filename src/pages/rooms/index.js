import sockets from '../../socket'
import useAuth from '@context/auth/useAuth'
import { useRouter } from 'next/router'
import {
  getRooms,
  getRoomsLessTheUserRooms,
  subscribeToRoom
} from '../../petitions'
import style from '../../styles/Rooms.module.scss'
import { useQuery, useQueryClient } from 'react-query'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RoomListItem from '@components/roomListItem'
import basePath from '../../helpers/basePath'
export default function Rooms () {
  const { user, setCambio, isLogged, userIsLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: rooms } = useQuery(
    ['getRooms', user],
    () => getRoomsLessTheUserRooms(user.id),
    {
      // initialData: () => {
      //   const roomsAux = []
      //   if (user) {
      //     if (user.rooms) {
      //       for (let i = 0; i < initialRooms.length; i++) {
      //         if (user.rooms.indexOf(initialRooms[i]._id) === -1) {
      //           roomsAux.push(initialRooms[i])
      //         }
      //       }
      //     }
      //     return roomsAux
      //   }
      // }
    }
  )

  // const renderIconPerType = (type) => {
  //   if (type === 'Publica') {
  //     return <FontAwesomeIcon icon={faUnlock} style={{ color: 'white' }} />
  //   } else {
  //     return <FontAwesomeIcon icon={faLock} style={{ color: 'white' }} />
  //   }
  // }

  const joinRoom = async (idRoom) => {
    console.log('aaa')

    const idUser = user.id
    const response = await subscribeToRoom({ idRoom, idUser })
    console.log(response.success)
    if (response.success) {
      sockets.emit('joinRoom', idRoom)
      setCambio(idRoom)
      router.push({
        pathname: '/rooms/[room]',
        query: { room: idRoom }
      })

      queryClient.invalidateQueries('prueba')
      queryClient.invalidateQueries('getRooms')
    } else {
      alert('No puedes entrar a esta sala')
    }
  }

  function Main () {
    // const roomInformation = (room) => {
    //   return (
    //     <>
    //       <div id="usersInGroup" className="flexItem">
    //         <FontAwesomeIcon icon={faUser} />
    //         &nbsp;
    //         {room.users.length}
    //       </div>
    //       <div className="flexItem">{renderIconPerType(room.type)}</div>
    //     </>
    //   )
    // }
    return (
      <div className={style.room}>
        {rooms.map((room) => (
          <RoomListItem
            key={room._id}
            name={room.name}
            roomId={room._id}
            image={room.image}
            joinFunction={joinRoom}
          />
        ))}
      </div>
    )
  }

  return rooms && isLogged() && !userIsLoading && user != null
    ? (
    <Main />
      )
    : (
    <h1>No hay salas</h1>
      )
}

// export async function getServerSideProps () {
//   console.log('AIUUUDa')
//   const response = await (await fetch('http://localhost:5000/room')).json()
//   console.log(response)
//   return {
//     props: { initialRooms: response }
//   }
// }
