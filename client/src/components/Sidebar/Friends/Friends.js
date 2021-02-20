import {useEffect} from "react"
import Friend from "./Friend/Friend"
import { useGlobalContext } from "../../../contexts/GlobalContext"
import { useSocketContext } from "../../../contexts/SocketContext"

export default function Friends({ showingTab, showChat }) {
  const { user, setUser } = useGlobalContext()
  const { socketIO } = useSocketContext()

  useEffect(() => {
    if (showingTab === 'friends') {
      socketIO.emit('friends', {userId: user.id})
      socketIO.on('friends', friends => {
        setUser({...user, friends: friends})
      } )
    }
  }, [showingTab])

  return (
    <>
      {showingTab === "friends" && (
        <div className="chats p-3">
          <ul className="p-1">
            {user.friends && user.friends.map((f, index) => (
              <Friend 
                key={index} 
                username={f.username} 
                id={f._id} 
                isOnline={f.isOnline} 
                showChat={showChat}
                />
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
