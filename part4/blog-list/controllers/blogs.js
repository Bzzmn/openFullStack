const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  if (!request.user.id){
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url:  body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: request.user.id
  })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!request.user.id){
    return response.status(401).json({ error: 'token invalid' })
  } else if(request.user.id !== blog.user.toString()){
    return response.status(401).json({ error: 'token unauthorized to make this change' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!request.user.id){
    return response.status(401).json({ error: 'token invalid' })
  } else if(request.user.id !== blog.user.toString()){
    return response.status(401).json({ error: 'token unauthorized to make this change' })
  }

  const body = request.body
  const blogUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogUpdate, { new: true })
  response.status(204).json(updatedBlog)
})

module.exports = blogsRouter