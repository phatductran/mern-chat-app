const { v4: uuidv4 } = require("uuid")
const { getRooms, getRoomById, joinRoom, getMembers, leaveRoom } = require("./controllers/Room")
const { getUserById, addFriend, getFriendList, setOnlineStatus, setSocketId } = require("./controllers/User")

module.exports = (io) => {
    io.on("connection",async (socket) => {
    let user
    let room

    socket.on('registry',async ({userId}) => {
      user = await getUserById(userId)
      if (user) {
        await setOnlineStatus(userId, true)
        await setSocketId(userId, socket.id)
      }
    })


    socket.on('friends', async ({userId}) => {
      user = await getUserById(userId)

      if (user) {
        const {error, friends} = await getFriendList(userId)
        
        if (friends) {
          socket.emit('friends', friends)
        }
      }
    })

    socket.on("rooms", async ({userId}) => {
      user = await getUserById(userId)

      if (user) {
        const rooms = await getRooms()
        socket.emit('rooms', rooms)
      }
    })

    socket.on("join", async ({ userId, roomId }) => {
      room = await getRoomById(roomId)
      user = await getUserById(userId)
      
      if (user && room) {
        socket.join(roomId)
        await joinRoom(roomId, userId)
        socket.emit("join", {
          from: { id: uuidv4(), name: "Admin" },
          room: room,
          text: "Welcome to the chat!",
        })

        socket.broadcast.to(roomId).emit("message", {
          from: { id: uuidv4(), name: "Admin" },
          text: `${user.username} has joined`,
        })

        const members = await getMembers(roomId)
        io.to(roomId).emit("roomData", {members})

      }
    })

    socket.on("sendMessage", async (message, cb) => {
      user = await getUserById(message.from.id)
      if (user && room) {
        io.to(room._id.toString()).emit("message", {
          from: { name: user.username, id: user._id },
          text: message.text,
        })

        cb()
      }
    })

    socket.on('private-message', async(msg, friendId, cb) => {
      user = await getUserById(msg.from.id)
      const friend = await getUserById(friendId)

      if(user && friend) {
        if(friend.socketId && friend.isOnline) {
          socket.to(friend.socketId.toString()).emit('private-message', {from: msg.from, text: msg.text})

          cb()
        }
      }
    })

    socket.on("leaveRoom", async ({ userId, roomId }) => {
      user = await getUserById(userId)
      socket.leave(roomId)
      await leaveRoom(roomId, userId)
      io.to(roomId).emit("message", {
        from: { id: uuidv4(), name: "Admin" },
        text: `${user.username} has left`,
      })

      const members = await getMembers(roomId)
      io.to(roomId).emit("roomData", {members})
    })

    // Friends
    socket.on("add-friend", async ({userId, friendId}) => {
      const {error, friends} = await addFriend(userId, friendId)
      if (friends) {
        socket.emit('add-friend', friends)
      }
    })

    socket.on('offline', async ({userId}) => {
      await setOnlineStatus(userId, false)
    })

    socket.on("disconnect", async () => {
      console.log(`User disconnected.`)
      
      if (user) {
        await setOnlineStatus(user._id, false)
        await setSocketId(user._id, null)
      }

      if (user && room) {
        await leaveRoom(room._id, user._id)
        
        io.to(room._id).emit("message", {
          from: { id: uuidv4(), name: "Admin" },
          text: `${user.username} has left`,
        })

        const members = await getMembers(room._id)
        io.to(room._id).emit("roomData", {members})
      }
    })
  })
}
