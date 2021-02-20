import {useHistory} from 'react-router'
import qs from 'query-string'
import './Chat.css'

export default function Chat({
  room, setShowChat
}) {
  const history = useHistory()
  
  const joinChat = (e) => {
    e.preventDefault()
    
    const {room} = qs.parseUrl(e.target.href).query
    if (room) {
      history.replace({
        search: `room=${room}`
      })
      setShowChat('room')
    }
  }

  return (
    <div className="chat-wrapper d-flex p-2 mt-2 justify-content-between align-items-center"
      
    >
      <div className="chat-container">
        <p className="chat-username font-weight-bold">{room.name}</p>
        <p className="chat-last-msg">
          <span className="last-msg">Members</span>
          <small className="time font-italic"> - {room.members.length}</small>
        </p>
      </div>
      <div className="join-btn">
        <a href={`?room=${room._id}`}
          id={room._id}
          data-name={room.name}
          className="p-2"
          onClick={joinChat}>
          Join
        </a>
      </div>
    </div>
  )
}
