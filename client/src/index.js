import ReactDOM from "react-dom"
import App from "./App"

import { GlobalProvider } from "./contexts/GlobalContext"

import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  document.getElementById("root")
)
