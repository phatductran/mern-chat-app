import { FaBuilding, FaUsers } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useState } from "react"
import "./Tab.css"

export default function Tab({ name, showingTab, setShowingTab }) {
  const [icon, setIcon] = useState(() => {
    if (name === "room") {
      return <FaBuilding />
    }
    if (name === "friends") {
      return <FaUsers />
    }
  })

  const switchTab = (e) => {
    e.preventDefault()
    let parentNode = e.target.parentNode
    let nameTab = ""
    // a > span > svg > path

    // click on 'svg' element
    if (parentNode.nodeName === "SPAN") {
      parentNode = parentNode.parentNode
    } else if (parentNode.nodeName === "svg") {
      // click on 'path' element
      parentNode = parentNode.parentNode.parentNode
    }

    nameTab = parentNode.id.split("-")[0].trim()
    setShowingTab(nameTab)
  }

  return (
    <div className={`tab-container w-100 text-center pb-2 ${showingTab === name && "active"}`}>
      <Link
        className="d-flex flex-column"
        id={`${name}-tab`}
        to={`/${name.trim()}`}
        name={name}
        onClick={switchTab}
      >
        <span className="mr-2 tab-icon">{icon}</span>
        <span className="tab-name">{name}</span>
      </Link>
    </div>
  )
}
