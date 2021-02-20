import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup"
import FormLabel from "react-bootstrap/FormLabel"
import FormControl from "react-bootstrap/FormControl"
import Button from "react-bootstrap/Button"

import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {useGlobalContext} from '../contexts/GlobalContext'
import axios from "axios"
import Loading from '../components/Loading/Loading'

import "../components/Form/Form.css"

export default function Signup({isLogged, isLoading, setIsLoading}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { baseURL } = useGlobalContext()
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const history = useHistory()

  useEffect(() => {
    if (isLogged) {
      setIsLoading(true)
      history.push('/home')
    } else {
      setIsLoading(false)
    }
  }, [])
  
  const signupToServer = async () => {
    const user = { username, password, confirm_password: confirmPassword }
    try {
      const response = await axios.post(`${baseURL}/api/v1/signup`, { ...user })
      
      if (response.status === 201) {
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setError('')
        setSuccessMsg('Successfully! You can login now.')
      }
      
    } catch (error) {
      setSuccessMsg('')
      setError(error.response.data.error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { password, confirm_password } = e.target.elements

    if (password.value !== confirm_password.value) {
      setError('Password and Confirm do not match.')
    } else {
      return signupToServer()
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
              onSubmit={handleSubmit}
              >
              <h1 className="text-primary mb-3">Sign up</h1>
              <div className="p-5">
                <FormGroup className="px-5">
                  <Row className="pl-5">
                    <Col md={3}>
                      <FormLabel>Username</FormLabel>
                    </Col>
                    <Col md={8}>
                      <FormControl 
                        name="username" 
                        placeholder="Username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup className="px-5">
                  <Row className="pl-5">
                    <Col md={3}>
                      <FormLabel className>Password</FormLabel>
                    </Col>
                    <Col md={8}>
                      <FormControl
                        type="password"
                        name="password"
                        required
                        placeholder="*****"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup className="px-5">
                  <Row className="pl-5">
                    <Col md={3}>
                      <FormLabel className>Confirm Password</FormLabel>
                    </Col>
                    <Col md={8}>
                      <FormControl
                        type="password"
                        name="confirm_password"
                        required
                        placeholder="*****"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
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
                      {successMsg && (
                        <small className="success-error font-italic text-success">{successMsg}</small>
                      )}
                    </Col>
                    <Col md={3} className="text-right">
                      <Link to="/login" className="font-italic pr-2">
                        Login
                      </Link>
                    </Col>
                  </Row>
                </FormGroup>

                <FormGroup className="px-5 mt-4">
                  <Row className="px-5">
                    <Col className="text-center">
                      <Button type="submit" className="w-100">
                        Sign up
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
