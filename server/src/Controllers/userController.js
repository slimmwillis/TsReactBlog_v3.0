const subscriberModel = require("../Models/subscriberModel")
// const bcrypt = require("bcrypt");
// const validator = require("validator");
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" })
}
// req.body gives the data coming from the client/frontend
// status 400 - client error
// status 500 - server error
// .find() - finds multiple subscribers
// .findById - only finds out one subscriber
const registerSubscriber = async (req, res) => {
  try {
    const { name, email, password } = req.body

    let subscriber = await subscriberModel.findOne({ email })

    if (subscriber) return res.status(400).json("email already exist...")

    if (!name || !email || !password)
      return res.status(400).json("All fields are required...")

    // if (!validator.isEmail(email)) return res.status(400).json("email not valid...");
    // if (!validator.isStrongPassword(password)) return res.status(400).json("password must be strong...");

    subscriber = new subscriberModel({ name, email, password })
    // const salt = await bcrypt.genSalt(10);
    // subscriber.password = await bcrypt.hash(subscriber.password, salt);
    await subscriber.save()

    const token = createToken(subscriber._id)
    res.status(200).json({ _id: subscriber._id, name, email, token })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const loginSubscriber = async (req, res) => {
  const { email, password } = req.body

  try {
    let subscriber = await subscriberModel.findOne({ email })

    if (!subscriber) return res.status(400).json("Invalid Email or Password")

    // const isValidPassword = await bcrypt.compare(password, subscriber.password);

    if (!isValidPassword)
      return res.status(400).json("Invalid Email or Password")

    const token = createToken(subscriber._id)
    res
      .status(200)
      .json({ _id: subscriber._id, name: subscriber.name, email, token })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const findSubscriber = async (req, res) => {
  const subscriberId = req.params.id

  try {
    const subscriber = await subscriberModel.findById(subscriberId)
    res.status(200).json(subscriber)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

const getSubscribers = async (req, res) => {
  try {
    const subscriber = await subscriberModel.find()
    res.status(200).json(subscriber)
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

module.exports = {
  registerSubscriber,
  loginSubscriber,
  findSubscriber,
  getSubscribers
}
