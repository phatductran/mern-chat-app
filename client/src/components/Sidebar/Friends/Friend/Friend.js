import { FaUser, FaFacebookMessenger } from "react-icons/fa"
import { useHistory } from "react-router-dom"
import {useState, useEffect} from 'react'
import { useSocketContext } from "../../../../contexts/SocketContext"


export default function Friend({username, id, isOnline, showChat}) {
  const history = useHistory()
  const [unseen, setUnseen] = useState(false)
  const {socketIO} = useSocketContext()

  useEffect(() => {
    socketIO.on('private-message', msg => {
      if (showChat === 'private') {
        setUnseen(true)
      }
    })
    
  }, [unseen, socketIO, showChat])

  const handleChat = (e) => {
    let friendId = null
    let friendUsername = null

    if (e.target.nodeName === 'path') {
      friendId = e.target.parentNode.parentNode.dataset.id
      friendUsername = e.target.parentNode.parentNode.dataset.username
    } else if(e.target.nodeName === 'SVG') {
      friendId = e.target.parentNode.dataset.id
      friendUsername = e.target.parentNode.dataset.username
    } else if(e.target.nodeName === 'BUTTON') {
      friendId  = e.target.dataset.id
      friendUsername  = e.target.dataset.username
    }

    if(friendId && friendUsername) {
      history.replace({
        search: `?friendId=${friendId}&username=${friendUsername}`
      })
      setUnseen(false)
    }
  }

  return (
    <>
      <li 
        className="p-2 d-flex justify-content-between mb-1 align-items-center"
        data-id={id}>
        <div className="pl-2 d-flex align-items-center">
          <span className="font-italic">
            <FaUser className="mr-1" />
            {username}
          </span>
          {
          unseen &&
          <div
          className="ml-2 bg-warning"
          style={{height: "10px", width: "10px"}}></div>}
          
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div 
            className={` ${isOnline ? 'bg-success' : 'bg-danger'} mr-2`}
            style={{height: "16px", width: "16px"}}>
          </div>
          <div>
            {isOnline && 
            <button 
              className="btn-primary"
              data-id={id}
              data-username={username}
              onClick={handleChat}>
              <FaFacebookMessenger 
                style={{color: "#F9F1FA", backgroundColor: "#746CAD"}}
              />
            </button>}
            
          </div>
        </div>
      </li>
    </>
  )
}
