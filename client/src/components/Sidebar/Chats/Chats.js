import React from 'react'

import Chat from './Chat/Chat'

export default function Chats({
  rooms,
  showingTab,
  setShowChat }) {
  return (
    <>
    {showingTab === 'room' && (
      <div className="chats p-3">
        {rooms.map((room, index) => (
          <Chat 
            key={index} 
            room={room}
            setShowChat={setShowChat}
            />
            ))}
        </div>
        )
    }
    </>
  )
}
