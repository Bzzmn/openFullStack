const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<2) {
  console.log('error: not enough arguments')
  process.exit(1)
}

const url = process.env.TEST_MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: process.argv[2],
  important: Math.random() < 0.5,
})

note.save().then(() => {
  console.log('note saved!')
  mongoose.connection.close()
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})