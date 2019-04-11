const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: function (value) {
        return User
          .findOne({ email: value })
          .then(user => user ? Promise.resolve(false) : Promise.resolve(true))
          .catch(err => Promise.resolve(false))
      },
      message: 'Email must be unique'
    }
  },
  password: {
    type: String,
    require: true
  },
  favoritesJokes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'joke' }]
})

const User = mongoose.model('user', userSchema)

module.exports = User