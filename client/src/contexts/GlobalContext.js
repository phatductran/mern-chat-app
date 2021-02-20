import { createContext, useContext, useState} from "react"
const GlobalContext = createContext()

const baseURL = "http://localhost:5000"

const getUserData = () => {
  const userInfo = localStorage.getItem("userInfo")

  if (userInfo) {
    return (JSON.parse(userInfo))
  } else {
    return (null)
  }
}

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserData())

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        baseURL
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

export { GlobalProvider }
