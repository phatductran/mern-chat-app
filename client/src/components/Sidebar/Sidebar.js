import Chats from "./Chats/Chats"
import Tabs from "./Tabs/Tabs"
import Members from "./Members/Members"
import Friends from "./Friends/Friends"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import {FaTimes} from 'react-icons/fa'
import "./Sidebar.css"

export default function Sidebar({ rooms, room, showingTab, setShowingTab, showChat, setShowChat, toggleMenuBar}) {
  const [title, setTitle] = useState("rooms")

  useEffect(() => {
    if (showingTab === "room") {
      if (!room) {
        setTitle("rooms")
      } else {
        setTitle("members")
      }
    } else {
      setTitle("friends")
    }
  }, [room, showingTab])
 
  return (
    <>
      <aside className="sidebar-wrapper d-flex flex-column justify-content-between border-right">
        <div className="header d-flex justify-content-between py-2 px-4 align-items-center">
          <h3 className="text-uppercase">{title}</h3>
          
          <div>
          <Link 
            to="/"
            className="text-dark d-md-none d-lg-none d-xl-none"
            onClick={toggleMenuBar}>
            <FaTimes />
          </Link>
          </div>
        </div>
        <div className="sidebar-chats d-flex flex-column h-100">
          {!room && title === "rooms" && (
            <Chats rooms={rooms} showingTab={showingTab} setShowChat={setShowChat} />
          )}
          {!room && title === "friends" && <Friends showingTab={showingTab} showChat={showChat} />}

          {room && <Members showingTab={showingTab} />}
        </div>

        <div className="sidebar-tabs d-flex flex-column">
          <Tabs room={room} showingTab={showingTab} setShowingTab={setShowingTab} />
        </div>
      </aside>
    </>
  )
}
