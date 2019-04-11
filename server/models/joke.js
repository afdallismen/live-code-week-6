const mongoose = require('mongoose')

const jokeSchema = mongoose.Schema({
  authorId: mongoose.Schema.Types.ObjectId,
  text: {
    type: String,
    required: true
  }
})

const Joke = mongoose.model('joke', jokeSchema)

module.exports = Joke