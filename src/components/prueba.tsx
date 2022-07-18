setUseAux(() => {
  const owo: any = 'q3q'
  if (messageAux !== null && messageAux !== undefined) {
    useAux.forEach((chat) => {
      if (chat.props.chat.room._id === messageAux.room) {
        return (chat.props.chat.lastMessage = messageAux)
      }
    })
    return useAux

    // owo = useAux.find(s
    //   (chat) => chat.props.chat.room._id === messageAux.room
    // )

    // const ewe = useAux.indexOf(owo)

    // const mensajeEnviado = useAux[ewe]
    // const aux = useAux.slice(0, ewe)
    // const mama = useAux.slice()
    // mama.splice(0, ewe + 1)

    // aux.unshift(mensajeEnviado)
    // mama.unshift(...aux)

    // return mama
  }

  if (receivingMessageDashboard !== null) {
    useAux.forEach((chat) => {
      if (chat.props.chat.room._id === receivingMessageDashboard.room) {
        chat.props.chat.lastMessage = receivingMessageDashboard
      }
    })
    setReceivingMessageDashboard(null)
  }
})
