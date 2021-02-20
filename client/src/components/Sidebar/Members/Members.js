import Member from './Member/Member'
import {useState, useEffect} from 'react'
import {useSocketContext} from '../../../contexts/SocketContext'
import "./Members.css"

export default function Members({ showingTab }) {
  const {socketIO} = useSocketContext()
  const [members, setMembers] = useState([])

  useEffect(() => {
    socketIO.on('roomData', data => {
      setMembers(data.members)
    })
  }, [members, socketIO])

  return (
    <>
      {showingTab === "room" && (
        <div className="chats p-3">
          <ul className="ml-2 pl-1">
            {members.map((mem, index) => (
              <Member 
                key={index} 
                username={mem.username}
                userId={mem._id}
                />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
