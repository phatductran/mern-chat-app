import { useGlobalContext } from "../../../../contexts/GlobalContext"
import { useState, useEffect } from "react"


export default function Message({ message }) {
  const { user } = useGlobalContext()
  const [renderComp, setRenderComp] = useState(null)
  
  const components = {
    currentUser: (
      <>
        <li className="p-2 m-1 text-right">
          {message.text && <p className="m-0 py-2 px-3 bg-primary text-white ">{message.text}</p>}
          <small className="mb-3 ml-2 font-weight-bold text-secondary font-italic">You</small>
        </li>
      </>
    ),
    member: (
      <>
        <li className="p-2 m-1 text-left">
          <small className="mb-3 mr-2 font-weight-bold text-secondary font-italic">
            {message.from.name}
          </small>
          {message.text && <p className="py-2 px-3 m-0 bg-secondary text-white">{message.text}</p>}
        </li>
      </>
    ),
    admin: (
      <>
        <li className="m-1 text-left">
          <p className="p-2 m-0 text-secondary font-italic">{message.text}</p>
        </li>
      </>
    ),
  }

  useEffect(() => {
    if (message.from.name === "Admin") {
      setRenderComp(components.admin)
    } else if (message.from.id === user.id) {
      setRenderComp(components.currentUser)
    } else {
      setRenderComp(components.member)
    }
  }, [message])

  return (
    <>
      {renderComp}
    </>
  )
}
