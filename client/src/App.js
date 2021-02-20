import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { useState } from "react"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import ErrorPage from "./pages/ErrorPage"
import { useGlobalContext } from "./contexts/GlobalContext"
import { SocketProvider } from "./contexts/SocketContext"

import "./App.css"

function App() {
  const { user } = useGlobalContext()
  const [isLogged, setIsLogged] = useState(() => user != null)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Router>
      <Switch >
        <Route exact path="/" render={() => {
            if (isLogged) {
              return <Redirect to="/home" />
            } else {
              return <Redirect to="/login" />
            }
          }}
        />
        <Route path="/login" >
          <Login
            isLogged={isLogged}
            setIsLogged={setIsLogged}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Route>
        <Route path="/signup" >
          <Signup isLogged={isLogged} isLoading={isLoading} setIsLoading={setIsLoading} />
        </Route>

        <SocketProvider>
          <Route path="/home">
            <Home
              isLogged={isLogged}
              setIsLogged={setIsLogged}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Route>
        </SocketProvider>

        <Route path="/*" >
          <ErrorPage />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
