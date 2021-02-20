const Room = require('../models/Room')

module.exports = {
  createDefaultRooms: async () => {
    try {
      const createdRooms = await Room.find()
      if (createdRooms.length === 0) {
        const rooms = [
          {name: 'Public room #1'},
          {name: 'Public room #2'},
          {name: 'Public room #3'}
        ]
        const defaultRooms = await Room.create(rooms)

        return defaultRooms
      }
    } catch (error) {
      throw error
    }
  },

  getRooms: async () => {
    try {
      return await Room.find()       
    } catch (error) {
      throw error
    }
  },

  getRoomById: async (id) => {
    try {
      const room = await Room.findOne({_id: id}).lean()

      return room
    } catch (error) {
      throw error
    }
  },

  joinRoom: async (id, userId) => {
    try {
      const room = await Room.findOne({_id: id})
      
      if (room && room.members) {
        const isJoined = room.members.findIndex(mem => mem.toString() === userId)
        
        if (isJoined === -1 && userId) {
          room.members.push(userId)
          await room.save()
        }
      }

      return null
    } catch (error) {
      throw error
    }
  },

  getMembers: async(roomId) => {
    try {
      const members = await Room.findOne({_id: roomId})
      .populate({
        path: 'members', 
        select: 'username _id isOnline friends'
      })
      
      return members.members
    } catch (error) {
      throw error
    }
  },

  leaveRoom: async (id, userId) => {
    try {
      const room = await Room.findOne({_id: id})

      if (room) {
        const isJoined = room.members.findIndex(mem => mem.toString() === userId)
        
        if (isJoined !== -1) {
          room.members.splice(isJoined, 1)
          await room.save()
        }
      }

      return null
    } catch (error) {
      throw error
    }
  }
}