import {createContext, useContext, useState} from 'react'
import {io} from 'socket.io-client'

const ENDPOINT = 'https://ducphattran-chat-app.herokuapp.com'

const SocketContext = createContext()

const SocketProvider = ({children}) => {
  const [socketIO, setSocketIO] = useState(() => io(ENDPOINT))
  
  return (
    <SocketContext.Provider value={{
      socketIO
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext () {
  return useContext(SocketContext)
}

export { SocketProvider }