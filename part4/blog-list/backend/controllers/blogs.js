const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const middleware = require('../utils/middleware')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  
  const body = request.body
  const userId = request.userId

  if (!userId) {
    return response.status(401).send({ error: 'unauthorized user' })
  }

  const user = await User.findById(userId)

  if (!body.title || !body.url) {
    return response.status(400).send({ error: 'title and url are required' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {

  const userId = request.userId

  if (!userId) {
    return response.status(401).send({ error: 'unauthorized user' })
  }

  const user = await User.findById(userId)

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).send({ error: 'invalid blog id' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).send({ error: 'unauthorized user' })
  }

  await Blog.findByIdAndDelete(blog._id)
  user.blogs = user.blogs.filter(b => b.toString() !== blog._id.toString())
  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  const userId = request.userId
  
  if (!userId) {
    return response.status(401).send({ error: 'unauthorized user' })
  }

  const user = await User.findById(userId)
  const blog =  await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).send({ error: 'invalid blog id' })
  }
  
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).send({ error: 'unauthorized user' })
  }

  const updatedBlog = {
    likes: request.body.likes,
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.json(result)
})

module.exports = blogsRouter