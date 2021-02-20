import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import Sidebar from "../components/Sidebar/Sidebar"
import Conversation from "../components/Conversation/Conversation"
import Loading from '../components/Loading/Loading'
import { useSocketContext } from "../contexts/SocketContext"
import { useGlobalContext } from "../contexts/GlobalContext"
import {useEffect, useState, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import qs from 'query-string'

export default function Home({isLogged, setIsLogged, isLoading, setIsLoading}) {
  const { socketIO } = useSocketContext()
  const {user} = useGlobalContext()
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState(null)
  const [privateChat, setPrivateChat] = useState(null)
  const [showChat, setShowChat] = useState(null)
  const [showingTab, setShowingTab] = useState('room')
  const history = useHistory()
  const location = useLocation()

  const sidebarMenu = useRef(null)
  const conversationTab = useRef(null)

  useEffect(() => {
    if (!isLogged) {
      setIsLoading(true)
      return history.push('/login')
    } else {
      setIsLoading(false)
    }

    socketIO.emit('registry', {userId: user.id})
  }, [])

  useEffect(() => {
    const queryParam = qs.parse(location.search)
    if (location.search && queryParam.room) {
      const roomId = queryParam.room
      socketIO.emit('join', {userId: user.id, roomId: roomId})
      setRoom(roomId)
      setShowChat('room')
    } else {
      socketIO.emit('rooms', {userId: user.id})
      socketIO.on('rooms', r => {
        setRooms(r)
      })
    }
  }, [location.search, socketIO])

  const logout = (e) => {
    e.preventDefault()

    setIsLoading(true)
    localStorage.removeItem("userInfo")
    setIsLogged(false)
    socketIO.emit('offline', {userId: user.id})
    history.push('/login')
  }

  const toggleMenuBar = (e) => {
    e.preventDefault()

    sidebarMenu.current.classList.toggle('d-none')
    sidebarMenu.current.classList.toggle('d-sm-block')
    conversationTab.current.classList.toggle('d-none')
  }

  return (
    <>
    {isLoading 
    ? <Loading /> 
    : (
      <Container fluid style={{ height: "100vh" }}>
        <Row style={{ height: "100vh" }}>
          <Col  
            lg={2} ref={sidebarMenu}
            className={`p-0 d-md-none d-lg-block d-none p`} >
            <Sidebar 
              rooms={rooms}
              room={room}
              showingTab={showingTab}
              setShowingTab={setShowingTab}
              showChat={showChat}
              setShowChat={setShowChat}
              toggleMenuBar={toggleMenuBar}
            />
          </Col>
          <Col 
            lg={10} xs={12} ref={conversationTab}
            className="p-0" 
            style={{ backgroundColor: "#F9F1FA", maxHeight: "100vh" }}>
            <Conversation 
              socket={socketIO}
              room={room}
              setRoom={setRoom}
              privateChat={privateChat}
              setPrivateChat={setPrivateChat}
              showChat={showChat}
              setShowChat={setShowChat}
              logout={logout} 
              toggleMenuBar={toggleMenuBar}
            />
          </Col>
        </Row>
      </Container>
    )}
    </>
  )
}
