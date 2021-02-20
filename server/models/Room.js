const mongoose= require('mongoose')

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {timestamps: true})

module.exports = mongoose.model('Room', RoomSchema)