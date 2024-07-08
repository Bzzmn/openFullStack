const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('assert')
const api = supertest(app)
const helper = require('../utils/test_helper')
const bcrypt = require('bcrypt')

describe('Blogs CRUD', () => {

    beforeEach(async () => {
        await User.deleteMany({});
        const saltRounds = 10;
    
        const userPromises = helper.initialUsers.map(async (initialUser) => {
            let user = new User(initialUser);
            user.passwordHash = await bcrypt.hash(initialUser.password, saltRounds);
            return user.save();
        });
    
        await Promise.all(userPromises);

        await Blog.deleteMany({})
        let user = await User.findOne({ username: helper.initialUsers[0].username })
        let newBlog = new Blog(helper.initialBlogs[0])
        newBlog.user = user._id
        await newBlog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        user = await User.findOne({ username: helper.initialUsers[1].username }) 
        newBlog = new Blog(helper.initialBlogs[1])
        newBlog.user = user._id
        await newBlog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        newBlog = new Blog(helper.initialBlogs[2])
        newBlog.user = user._id
        await newBlog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        user = await User.findOne({ username: helper.initialUsers[2].username })
        newBlog = new Blog(helper.initialBlogs[3])
        newBlog.user = user._id
        await newBlog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        newBlog = new Blog(helper.initialBlogs[4])
        newBlog.user = user._id
        await newBlog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()

        newBlog = new Blog(helper.initialBlogs[5])
        newBlog.user = user._id
        await newBlog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()
        
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });
    
    test('the number of blogs returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.status, 200)
        assert.strictEqual(response.body.length, 6)
    });
    
    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.status, 200)
        assert.ok(response.body.every(blog => blog.id && !blog._id), 'Every blog post has an id property and not _id')
    });
    
    test('HTTP POST to /api/blogs successfully creates a new blog post, increasing the total number of blogs by one', async () => {
        const newBlog = {
            title: "Exploring the Edge of the Universe",
            author: "Neil deGrasse Tyson",
            url: "https://cosmos.com/universe-edge.html",
            likes: 15
        };
    
        const initialResponse = await api.get('/api/blogs')
        const initialBlogsCount = initialResponse.body.length

        const user = await User.findOne({ username: helper.initialUsers[1].username })

        const loginResponse = await api
            .post('/api/login')
            .send({ username: user.username, password: helper.initialUsers[1].password })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = loginResponse.body.token
        
        const postResponse = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const finalResponse = await api.get('/api/blogs')
        const finalBlogsCount = finalResponse.body.length
    
        assert.strictEqual(finalBlogsCount, initialBlogsCount + 1)
    
        const titles = finalResponse.body.map(blog => blog.title)
        assert.ok(titles.includes('Exploring the Edge of the Universe'))
    });

    test('if the token is missing, the backend responds with 401 Unauthorized', async () =>  {
        
        const newBlog = {
            title: "Exploring the Edge of the Universe",
            author: "Neil deGrasse Tyson",
            url: "https://cosmos.com/universe-edge.html",
            likes: 15
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/);

    })

    
    test('if the likes property is missing from the request, it defaults to 0', async () => {
        const newBlogWithoutLikes = {
            title: "Mysteries of the Quantum Universe",
            author: "Thibault Damour",
            url: "https://quantumuniverse.com"
        };

        const user = await User.findOne({ username: helper.initialUsers[1].username })

        const loginResponse = await api
            .post('/api/login')
            .send({ username: user.username, password: helper.initialUsers[1].password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        const token = loginResponse.body.token
    
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    
        assert.strictEqual(response.body.likes, 0)    
    });
    
    test('backend responds with 400 Bad Request if the title property is missing from the request data', async () => {
        const newBlogWithoutTitle = {
            author: "Carl Sagan",
            url: "https://cosmos.com",
            likes: 4
        };

        const user = await User.findOne({ username: helper.initialUsers[1].username })

        const loginResponse = await api
            .post('/api/login')
            .send({ username: user.username, password: helper.initialUsers[1].password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        const token = loginResponse.body.token
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutTitle)
            .expect(400);
    });
    
    test('backend responds with 400 Bad Request if the url property is missing from the request data', async () => {
        const newBlogWithoutUrl = {
            title: "Pale Blue Dot",
            author: "Carl Sagan",
            likes: 4
        };

        const user = await User.findOne({ username: helper.initialUsers[1].username })

        const loginResponse = await api
            .post('/api/login')
            .send({ username: user.username, password: helper.initialUsers[1].password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        const token = loginResponse.body.token
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutUrl)
            .expect(400);
    });
    
    test('HTTP DELETE to a blog id performs correctly', async () => {
        const initialResponse = await api.get('/api/blogs')
        const initialBlogsCount = initialResponse.body.length
    
        const blogToDelete = initialResponse.body[0]

        const user = await User.findOne({ username: helper.initialUsers[0].username })
        
        const loginResponse = await api
            .post('/api/login')
            .send({ username: user.username, password: helper.initialUsers[0].password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const token = loginResponse.body.token
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    
        const finalResponse = await api.get('/api/blogs')
        const finalBlogsCount = finalResponse.body.length
    
        assert.strictEqual(finalBlogsCount, initialBlogsCount - 1)
    })
    
    test('HTTP PUT to a blog id updates the blog post correctly', async () => {
        const initialResponse = await api.get('/api/blogs')
        const blogToUpdate = initialResponse.body[0]
        const updatedBlog = {
            likes: 10
        }

        const user = await User.findOne({ username: helper.initialUsers[0].username })

        const loginResponse = await api
            .post('/api/login')
            .send({ username: user.username, password: helper.initialUsers[0].password }) 
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const token = loginResponse.body.token
    
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        assert.strictEqual(response.body.likes, 10)
    })
})

describe('Users CRUD', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const saltRounds = 10;
    
        const userPromises = helper.initialUsers.map(async (initialUser) => {
            let user = new User(initialUser);
            user.passwordHash = await bcrypt.hash(initialUser.password, saltRounds);
            return user.save();
        });
    
        await Promise.all(userPromises);
    });

    test('User creating a new account', async () => {
        const newUser = {
            username: "newUser",
            name: "New User",
            password: "newUserPassword"
        }
    
        const initialResponse = await api.get('/api/users')
        const initialUsersCount = initialResponse.body.length
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const finalResponse = await api.get('/api/users')
        const finalUsersCount = finalResponse.body.length
    
        assert.strictEqual(finalUsersCount, initialUsersCount + 1)
    })

    test('user creation fails with proper status code and message if username is already taken', async () => {
        const newUser = {
            username: "cdescartes",
            name: "Cartes Carter",
            password: "password"
        }
    
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            .expect({ error: 'username must be unique' })
    })
})


after(async () => {
    await mongoose.connection.close()
});
 
