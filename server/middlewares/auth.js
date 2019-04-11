const jwt = require('jsonwebtoken')

const models = require('../models')

module.exports = {
  loggedIn: (req, res, next) => {
    let token = req.headers['access-token']
    if (token) {
      try {
        let payload = jwt.verify(token, process.env.JWT_SECRET)
        models.User
          .findById(payload._id)
          .then(user => {
            if (user) {
              req.user = user
              next()
            } else {
              res.status(400).json({ message: 'Token verification failed'})
            }
          })
          .catch(err => res.status(500).json(err))
      } catch {
        res.status(400).json({ message: 'Token verification failed'})
      }
    } else {
      res.status(400).json({ message: 'Token missing'})
    }
  },
  isJokeOwner: (req, res, next) => {
    models.Joke
      .findById(req.params.joke_id)
      .then(joke => {
        if (joke) {
          if (String(joke.authorId) === String(req.user._id)) {
            next()
          } else {
            res.status(401).json('Unauthorized')
          }
        } else {
          res.status(400).json('Bad request')
        }
      })
      .catch(err => res.status(500).json(err))
  }
}