const User = require("../models/User")

module.exports = {
  addFriend: async (userId, friendId) => {
    try {
      const user = await User.findOne({ _id: userId })
      const friend = await User.findOne({ _id: friendId })
      if (user && friend) {
        const friendToUser = user.friends.find((f) => f.toString() === friend._id.toString())

        if (!friendToUser) {
          user.friends.push(friend._id)
          await user.save()
        }

        const friendToFriend = friend.friends.find((f) => f.toString() === user._id.toString())

        if (!friendToFriend) {
          friend.friends.push(user._id)
          await friend.save()
        }

        return { friends: user.friends }
      }

      return { error: null }
    } catch (error) {
      return { error: error }
    }
  },
  getUserById: async (id) => {
    try {
      const user = await User.findOne({ _id: id }).populate({
        path: "friends",
        select: "_id username",
      })

      return user
    } catch (error) {
      return { error: error }
    }
  },
  getFriendList: async (id) => {
    try {
      const user = await User.findOne({ _id: id }).populate({
        path: "friends",
        select: "_id username isOnline",
      })
      
      if (user) {
        return { friends: user.friends }
      }

      return { error: null }
    } catch (error) {
      return { error: error }
    }
  },
  setOnlineStatus: async (id, status) => {
    if (typeof status != "boolean") {
      return { error: "status is not valid" }
    }

    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { isOnline: status },
        { new: true }
      ).lean()

      if (user) {
        return { user }
      }

      return { error: null }
    } catch (error) {
      throw error
    }
  },
  setSocketId: async (id, socketId) => {
    try {
      const user = await User.findOne({_id: id})
      if(user) {
        user.socketId = socketId
        await user.save()
        return {user}
      }

      return {error: null}
    } catch (error) {
      return {error: error}
    }
  }
}
