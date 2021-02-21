import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup"
import FormLabel from "react-bootstrap/FormLabel"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"
import { FaUser, FaLock } from "react-icons/fa"

import "../components/Form/Form.css"
import Loading from '../components/Loading/Loading'
import { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { useGlobalContext } from "../contexts/GlobalContext"

export default function Login({ isLogged, setIsLogged,isLoading, setIsLoading}) {
  const [username, setUsername] = useState("phatductran")
  const [password, setPassword] = useState("1234")
  const [error, setError] = useState(null)
  const { baseURL, setUser } = useGlobalContext()
  const history = useHistory()

  useEffect(() => {
    if (isLogged) {
      setIsLoading(true)
      history.push('/home')
    } else {
      setIsLoading(false)
    }

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const { username, password } = e.target.elements

    setUsername(username.value)
    setPassword(password.value)

    return loginToServer()
  }

  const loginToServer = async () => {
    const user = { username, password }
    try {
      const response = await axios.post(`${baseURL}/api/v1/login`, { ...user })
      
      if (response.status === 200) {
        const userInfo = {
          id: response.data._id,
          username: response.data.username,
          jwtCode: response.data.jwtCode,
          friends: response.data.friends
        }

        localStorage.setItem("userInfo", JSON.stringify(userInfo))
        setIsLogged(true)
        setIsLoading(true)
        setUser(userInfo)
        history.push('/home')
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return setError(error.response.data.error)
      } else {
        throw error
      }
    }
  }

  return (
    <>
    {isLoading ? <Loading /> : (
      <div className="wrapper">
        <Container style={{ height: "100vh" }} className="d-flex flex-column p-5">
          <div className="p-5 my-auto">
            <Form
              className="p-5 form-wrapper"
              action="/login"
              method="POST"
              onSubmit={handleSubmit}
            >
              <h1 className="text-primary mb-3">Login</h1>
              <div className="p-5">
                <FormGroup className="px-5">
                  <Row className="pl-5">
                    <Col md={3}>
                      <FormLabel>
                        <FaUser className="mr-2" />
                        Username
                      </FormLabel>
                    </Col>
                    <Col md={8}>
                      <FormControl
                        name="username"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup className="px-5">
                  <Row className="pl-5">
                    <Col md={3}>
                      <FormLabel className>
                        <FaLock className="mr-2" />
                        Password
                      </FormLabel>
                    </Col>
                    <Col md={8}>
                      <FormControl
                        type="password"
                        name="password"
                        placeholder="*****"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup className="px-5">
                  <Row className="px-5">
                    <Col md={9}>
                      {error && (
                        <small className="invalid-error font-italic text-danger">{error}</small>
                      )}
                    </Col>
                    <Col md={3} className="text-right">
                      <Link to="/signup" className="font-italic pr-2">
                        Sign up
                      </Link>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup className="px-5 mt-4">
                  <Row className="px-5">
                    <Col className="text-center">
                      <Button type="submit" className="w-100">
                        Login
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    )}
    </>
  )
}
