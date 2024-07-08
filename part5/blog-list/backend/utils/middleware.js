const jwt = require('jsonwebtoken')
const config = require('./config')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

    // console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 dupicate key error')) {
        return response.status(400).json({ error: 'username must be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    }
    next(error)
}


const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.substring(7)
        request.token = token
    } 
    next()
}

const userExtractor = (request, response, next) => {
    if (request.token) {
        const decodedToken = jwt.verify(request.token, config.SECRET)
        if (!decodedToken || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        request.userId = decodedToken.id
    }
    next()
}

module.exports = { unknownEndpoint, errorHandler, tokenExtractor, userExtractor }