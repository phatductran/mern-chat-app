const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'jwt_secret'
const User = require('../models/User')

module.exports = {
  generateJwt: async (user) => {
    const jwt = jsonwebtoken.sign({
      sub: user._id,
      username: user.username
    }, jwtSecret, {
      expiresIn: "1m"
    } )

    try {
      const isUpdated = await User.findOneAndUpdate({_id: user._id}, {
        jwtCode: jwt
      }, {new: true}).populate({path: 'friends', select: '_id username'}).lean()
      
      return {user: isUpdated}
    } catch (error) {
      return {error: error.message}
    }
  }
}