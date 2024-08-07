const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/persons')

// Middlewares
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const mymorgan = morgan(function (tokens, req, res) {
    const body = JSON.stringify(req.body)
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        body
    ].join(' ')
})

app.use(mymorgan)

// DATA
let persons =
  [
      {
          'id': 1,
          'name': 'Arto Hellas',
          'number': '040-123456'
      },
      {
          'id': 2,
          'name': 'Ada Lovelace',
          'number': '39-44-5323523'
      },
      {
          'id': 3,
          'name': 'Dan Abramov',
          'number': '12-43-234345'
      },
      {
          'id': 4,
          'name': 'Mary Poppendieck',
          'number': '39-23-6423122'
      }
  ]

// CRUD
app.get('/', (req, res) => {
    res.send('Hello There')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then( person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    res.send('Phonebook has info for ' + persons.length + ' people <br>' + new Date())
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then( savedPerson => {
        res.json(savedPerson)
    })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number,
    }


    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndPoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndPoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

