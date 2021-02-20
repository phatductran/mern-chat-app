import Message from "./Message/Message"
import ScrollToBottom from "react-scroll-to-bottom"
import "./Messages.css"

export default function Messages({ messages }) {
  return (
    <div
      className="conversation-messages p-2 py-3 m-3"
      style={{ height: "80vh", maxHeight: "80vh" }}
    >
      <ScrollToBottom className="h-100" style={{ height: "80vh", maxHeight: "80vh" }}>
        <ul>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </ul>
      </ScrollToBottom>
    </div>
  )
}
