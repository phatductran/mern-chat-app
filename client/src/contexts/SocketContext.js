import {createContext, useContext, useState} from 'react'
import {io} from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000'

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