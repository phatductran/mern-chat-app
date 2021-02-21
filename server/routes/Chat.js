const router = require("express").Router()
const passport = require("passport")

router.get("/chat", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send(req.user)
})

router.get('/', (req,res) => {
  res.send('working')
})

module.exports = router
