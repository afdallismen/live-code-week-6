require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const cors = require('cors')

// const routes = require('./routes')
const ObjectId = mongoose.Schema.Types.ObjectId
const models = require('./models')
const { loggedIn, isJokeOwner } = require('./middlewares').auth

const app = express()

mongoose.connect('mongodb://localhost:27017/classic_fox_live_code_1', { useNewUrlParser: true, useCreateIndex: true })

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use('/', routes)

app.post('/register', (req, res) => {
  models.User
    .create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password) 
    })
    .then(user => res.status(201).json({ _id: user._id, email: user.email, password: user.password }))
    .catch(err => res.status(500).json(err))
})

app.post('/login', (req, res) => {
  models.User
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        let isValid = bcrypt.compareSync(req.body.password, user.password)
        if (isValid) {
          let token =  jwt.sign({
            _id: user._id,
            email: user.email
          }, process.env.JWT_SECRET)

          res.status(201).json({ access_token: token })
        } else {
          res.status(400).json({ message: 'Wrong email or password'})
        }
      } else {
        res.status(400).json({ message: 'Wrong email or password'})
      }
    })
    .catch(err => res.status(500).json(err))
})

app.post('/favorites', loggedIn, (req, res) => {
  models.Joke
    .create({ text: req.body.joke, authorId: req.user._id })
    .then(joke => res.status(201).json({ _id: joke._id, joke: joke.text }))
    .catch(err => res.status(500).json(err))
})

app.delete('/favorites/:joke_id', loggedIn, isJokeOwner, (req, res) => {
  models.Joke
    .findByIdAndDelete(req.params.joke_id)
    .then(joke => res.status(200).json({ _id: joke._id }))
    .catch(err => res.status(500).json(err))
})

app.get('/jokes', loggedIn, (req, res) => {
  models.Joke
    .find({ authorId: req.user._id })
    .then(jokes => res.status(200).json(jokes))
    .catch(err => console.log(err))
})

app.listen(3000, _ => {
  console.log('Listening on port 3000...')
})