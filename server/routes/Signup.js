const router = require("express").Router()
const { createUser } = require("../controllers/Signup")

router.post("/signup", async (req, res, next) => {
  try {
    const { user, error } = await createUser({ ...req.body })

    if (error) {
      return res.status(400).json({ error })
    }
    return res.status(201).json({ user })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
