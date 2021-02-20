import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useGlobalContext } from "../../../../contexts/GlobalContext"
import { useSocketContext } from "../../../../contexts/SocketContext"

export default function Member({ userId, username }) {
  const { user } = useGlobalContext()
  const [isFriend, setIsFriend] = useState(() => {
    console.log(user.friends, userId)
    if (user.friends) {
      const isAdded = user.friends.find((f) => f._id.toString() === userId.toString())
      if (isAdded) {
        return true
      }
    }

    return false
  })
  const [isCurrent, setIsCurrent] = useState(() => userId === user.id)
  const { socketIO } = useSocketContext()
  const addFriend = (e) => {
    e.preventDefault()

    const id = e.target.dataset.id

    socketIO.emit("add-friend", { userId: user.id, friendId: id })

    socketIO.on("add-friend", (msg) => {
      setIsFriend(true)
      setIsCurrent(false)
    })
  }

  return (
    <>
      <li className="p-2 d-flex justify-content-between mb-1 align-items-center">
        <span className="pl-2 font-italic">
          <FaUser className="mr-1" />
          {username}
        </span>
        <span className="add-friend-btn">
          {isCurrent && (
            <Link to={`/`} className="btn px-1 py-0 btn-info" onClick={(e) => e.preventDefault()}>
              You
            </Link>
          )}

          {isFriend && !isCurrent && (
            <Link to={`/`} className="btn px-1 py-0 btn-success" onClick={(e) => e.preventDefault()}>
              Friend
            </Link>
          )}

          {!isFriend && !isCurrent && (
            <Link
              to={`/add-friend?id=${userId}`}
              data-id={`${userId}`}
              className="btn px-1 py-0 btn-warning"
              onClick={addFriend}
            >
              Add friend
            </Link>
          )}
        </span>
      </li>
    </>
  )
}
