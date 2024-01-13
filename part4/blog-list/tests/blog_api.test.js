const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./blog_api_helper')
const User = require('../models/user')

beforeEach( async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is and id property on each blog document', async () => {
    const response = await api.get('/api/blogs')
    response.body.map( r => expect(r.id).toBeDefined())
  })
})

describe('Posting a new blog entry', () => {
  test('a blog can be added after login', async () => {
    const newLogin = {
      username: 'elonspice',
      password: 'spacex'
    }

    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`

    const newBlog = {
      title: 'Fly To The Moon',
      author: 'Robert C. Cacas',
      url: 'http://justanotherpage.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .set('Authorization', bearerKey)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'Fly To The Moon'
    )
  })


  test('a blog cant be added after failed login', async () => {
    const newLogin = {
      username: 'elonspice',
      password: 'space'
    }

    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`

    const newBlog = {
      title: 'Fly To The Moon',
      author: 'Robert C. Cacas',
      url: 'http://justanotherpage.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 9
    }

    await api
      .post('/api/blogs')
      .set('Authorization', bearerKey)
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).not.toContain(
      'Fly To The Moon'
    )
  })

  test('a new entry with no likes property get 0 likes by default', async () => {
    const newLogin = {
      username: 'elonspice',
      password: 'spacex'
    }

    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`
    const newBlog = {
      title: 'No One Has Liked This',
      author: 'Armando Pititos',
      url: 'http://laterriblepage.com/TestDefinitions.html'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', bearerKey)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'No One Has Liked This'
    )
    const lastAdded = blogsAtEnd.find( b => b.title === 'No One Has Liked This')
    expect(lastAdded.likes).toBeDefined()
    expect(lastAdded.likes === 0)
  })

  test('a new entry with no title gets status 400', async () => {
    const newLogin = {
      username: 'elonspice',
      password: 'spacex'
    }

    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`

    const newBlog = {
      author: 'Armando Pititos',
      url: 'http://laterriblepage.com/TestDefinitions.html',
      likes: 8
    }
    await api
      .post('/api/blogs')
      .set('Authorization', bearerKey)
      .send(newBlog)
      .expect(400)
  })

  test('a new entry with no url gets status 400', async () => {
    const newLogin = {
      username: 'elonspice',
      password: 'spacex'
    }

    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`

    const newBlog = {
      title: 'Some title',
      author: 'Armando Pititos',
      likes: 8
    }
    await api
      .post('/api/blogs')
      .set('Authorization', bearerKey)
      .send(newBlog)
      .expect(400)
  })
})

describe('Deleting/Updating a blog entry', () => {
  test('deleting an entry by id fails if not token provided', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const idToDelete = blogsAtStart[0].id
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const ids = blogsAtEnd.map( b => b.id )
    expect(ids).toContain(idToDelete)
  })

  test('deleting an entry by id', async () => {
    const newLogin = {
      username: 'elonspice',
      password: 'spacex'
    }

    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`

    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete('/api/blogs/65a210244a63537c1945e821')
      .set('Authorization', bearerKey)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const ids = blogsAtEnd.map( b => b.id )
    expect(ids).not.toContain('65a210244a63537c1945e821')
  })

  test('updating an entry by id', async () => {

    const newLogin = {
      username: 'elonspice',
      password: 'spacex'
    }
    const response = await api.post('/api/login').send(newLogin)
    const bearerKey = `Bearer ${response.body.token}`

    const toUpdate = {
      likes: 99
    }

    await api
      .put('/api/blogs/65a2eb280e53cc8817092df9')
      .set('Authorization', bearerKey)
      .send(toUpdate)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const updated = blogsAtEnd.find(b => b.id === '65a2eb280e53cc8817092df9')
    expect(updated.likes === toUpdate.likes)
  })
})

describe('Testing Users - when there is initially one in db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'akakkoki',
      name: 'Akak Koki',
      password: 'salame',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map( u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with a short username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ak',
      name: 'Akak Koki',
      password: 'salame',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map( u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails with a short name', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'akkkbar',
      name: 'Ak',
      password: 'salame',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map( u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'elonspice',
      name: 'Initial User',
      password: 'sekret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})