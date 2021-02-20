const router = require("express").Router()
const passport = require("passport")

router.get("/chat", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.send(req.user)
})

module.exports = router
