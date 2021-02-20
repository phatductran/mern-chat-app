import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import { FaPaperPlane, FaBars } from "react-icons/fa"

import qs from 'query-string'
import { useState, useEffect } from "react"
import {Link, useHistory} from 'react-router-dom'
import {useGlobalContext} from '../../contexts/GlobalContext'
import Messages from "./Messages/Messages"

import "./Conversation.css"

export default function Conversation({ 
  socket, room, setRoom, privateChat, setPrivateChat, showChat, setShowChat, logout, toggleMenuBar }) {
  const {user} = useGlobalContext()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState({text: ''})
  const [privateMessages, setPrivateMessages] = useState([])
  const [privateMessage, setPrivateMessage] = useState({text: ''})
  const history = useHistory()

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages(messages => [...messages, msg])
    })

    socket.on("private-message", (msg) => {
      setPrivateMessages(messages => [...messages, msg])
    })

  }, [])


  useEffect(() => {
    socket.on('join', msg => {
      const joinMsg =  { 
        from: msg.from,        
        text: msg.text
      }
      setMessages([joinMsg])
      setRoom(msg.room)
    })

    const {friendId, username} = qs.parse(history.location.search)
    if (friendId && username) {
      setPrivateChat({friendId, username})
      setShowChat('private')
    }

  }, [history.location.search, room])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (room && message.text) {
      socket.emit("sendMessage", 
        message, 
        () => {
          setMessage({text: ''})
          document.querySelector('[name="chatMessage"]').focus()
        })
    }
    
    if (privateChat && privateMessage.text) {
      socket.emit("private-message",
        privateMessage,
        privateChat.friendId,
        () => {
          setPrivateMessages(lastMsgs => [...lastMsgs, privateMessage])
          setPrivateMessage({text: ''})
          document.querySelector('[name="chatMessage"]').focus()
        })
    }
  }

  const leaveRoom = (e) => {
    e.preventDefault()

    socket.emit('leaveRoom', {userId: user.id, roomId: room._id})

    setRoom(null)
    history.replace({
      search: null
    })
    setShowChat(null)
  }

  const closePrivateMsg = (e) => {
    e.preventDefault()

    socket.emit('closeMessage', {})
    
    setPrivateChat(null)
    setShowChat(null)
    history.replace({
      search: null
    })
  }
  

  return (
    <>
      <div className="conversation-wrapper d-flex flex-column justify-content-between h-100">
        <div className="conversation-header px-4 py-3 d-flex justify-content-between">
          {room && showChat === 'room' &&
          (
            <>
            <Link 
              to='/home' 
              className='leave-btn p-1 mr-3' 
              onClick={leaveRoom}>
              Leave
            </Link>
            <h3 className="d-inline p-2">Room: {room.name}</h3>
            </>
          ) 
          }
          {privateChat && showChat === 'private' && (
            <>
            <Link 
              to='/home' 
              className='leave-btn p-1 mr-3' 
              onClick={closePrivateMsg}>
              Close
            </Link>
            <h3 className="d-inline p-2">{privateChat.username}</h3>
            </>
          )}
          {!room && !privateChat && (
            <p className="mb-0">
              Hello, 
              <span 
               className="font-weight-bold ml-2"
               style={{color: "#edec91"}}> 
               {user.username} </span>
               
            <Link
              to="/logout"
              className="ml-3 font-italic logout-btn p-1" 
              onClick={logout}>
              Logout
            </Link>
            </p>
          )}


          <div>
          <Link 
            to="/"
            className="text-dark d-md-none d-lg-none d-xl-none"
            onClick={toggleMenuBar}>
            <FaBars />
          </Link>
          </div>
        </div>

        {room && showChat === 'room' && (
          <>
            <Messages messages={messages} />

            <Form onSubmit={handleSubmit}>
              <div className="conversation-sender d-flex justify-content-between py-2 px-4 mx-4 mb-3">
                <div className="chat-inp mr-1">
                  <FormGroup className="m-0">
                    <FormControl
                      name="chatMessage"
                      placeholder="Aa"
                      className="mr-0"
                      value={message.text}
                      onChange={e => 
                        setMessage({
                          text: e.target.value,
                          from: {id: user.id, name: user.username}
                        })}
                    />
                  </FormGroup>
                </div>
                <div className="chat-send-btn">
                  <FormGroup className="m-0">
                    <Button type="submit" className="primary">
                      <FaPaperPlane className="mr-2" />
                      Send
                    </Button>
                  </FormGroup>
                </div>
              </div>
            </Form>
          </>)
        } 
        {privateChat && showChat === 'private' &&(
          <>
            <Messages messages={privateMessages} />

            <Form onSubmit={handleSubmit}>
              <div className="conversation-sender d-flex justify-content-between py-2 px-4 mx-4 mb-3">
                <div className="chat-inp mr-1">
                  <FormGroup className="m-0">
                    <FormControl
                      name="chatMessage"
                      placeholder="Aa"
                      className="mr-0"
                      value={privateMessage.text}
                      onChange={e => {
                        setPrivateMessage({
                          text: e.target.value,
                          from: {id: user.id, name: user.username}
                        })}
                      }
                    />
                  </FormGroup>
                </div>
                <div className="chat-send-btn">
                  <FormGroup className="m-0">
                    <Button type="submit" className="primary">
                      <FaPaperPlane className="mr-2" />
                      Send
                    </Button>
                  </FormGroup>
                </div>
              </div>
            </Form>
          </>
        )}

        { !showChat && (
            <>
            <Row className="h-50 p-0 m-0">
              <Col className="text-center">
                <h1>Welcome to the chat application</h1>
                <small className="font-italic">- Admin</small>
              </Col>
            </Row>
          </>
          )
        }

      </div>
    </>
  )
}
