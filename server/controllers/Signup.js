const User = require("../models/User")
const bcrypt = require("bcryptjs")

module.exports = {
  createUser: async ({ username, password, confirm_password }) => {
    const fields = { username, password, confirm_password }
    if (!username || !password || !confirm_password) {
      throw {
        message: "Required fields are not provided",
        fields: { ...fields },
      }
    }

    if (password !== confirm_password) {
      throw {
        message: "Password does not match with the Confirm password",
        fields: { ...fields },
      }
    }

    try {
      const user = new User({
        username: username.replace(/\s/g, ""),
        password: await bcrypt.hash(password, await bcrypt.genSalt()),
      })

      const isExistingUser = await User.findOne({ username: user.username })
      if (isExistingUser instanceof User) {
        return { error: "Username is taken" }
      } else {
        await user.save()
      }

      return { user }
    } catch (error) {
      return { error: error.message }
    }
  },
}
