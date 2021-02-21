if (process.env.NODE_ENV === 'production') {
  require('dotenv').config()
}
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const passport = require('passport')
const passportLocal = require('./auth/passport-local.js')
// const passportJwt = require('./auth/passport-jwt.js')

const {createDefaultRooms} = require('./controllers/Room')


const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
})

const PORT = process.env.PORT || 5000

const loginRouter = require('./routes/Login')
const signupRouter = require('./routes/Signup')
const chatRouter = require('./routes/Chat')

app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/v1", [loginRouter, signupRouter, chatRouter])

require('./socket')(io)

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bapzu.mongodb.net/chat-app?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    createDefaultRooms()

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => console.log(err))

