const router = require("express").Router()
const passport = require("passport")
const { generateJwt } = require("../controllers/Login")

router.post("/login", async (req, res, next) => {
  passport.authenticate("local",
    { session: false }, 
    async (err, userInfo) => {
      
      if (err) {
        return res.status(401).json({ error: err.message })
      }

      try {
        const { user, error } = await generateJwt(userInfo)

        if (error) {
          return res.status(401).json({ ...error })
        }
        
        return res.status(200).json({ ...user })
      } catch (error) {
        return res.status(500).json({ error: "Server error" })
      }
    })(req, res, next)
})

module.exports = router
