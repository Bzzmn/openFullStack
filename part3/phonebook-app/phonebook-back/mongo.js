require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', noteSchema)

switch (process.argv.length){
case 3:
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number )
    })
    mongoose.connection.close()
  })
  break
case 4:
  console.log('error: missing argument"number"')
  break
case 5:
  Person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
  break
default:
  console.log('error: uncaught error')
}