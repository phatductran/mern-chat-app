import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import {useState} from 'react'
import Error from '../components/Error/Error'

export default function ErrorPage() {
  const [errorCode, setErrorCode] = useState(400)

  return (
    <>
      <Container fluid style={{height: "100vh"}} className="bg-danger">
        <Row style={{height: "100vh"}}>
          <Col className="p-5 text-center text-white">
            <Error code={errorCode}/>
          </Col>
        </Row>
      </Container>
    </>
  )
}
