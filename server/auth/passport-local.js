const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false
  },
  async (username, password, done) => {
    try {
      const user = await  User.findOne({username: username})
      
      if (!user) {
        return done({message: 'Username does not exist.'})
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done({message: 'Password is incorrect.'})
      }
      
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
  ))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({_id: id})
    return user
  } catch (error) {
    return done(error)
  }
})