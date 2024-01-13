const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Infinity of Kaka',
    author: 'Charles Kakas',
    url: 'https://nae.com/shitugottaread.html',
    likes: 15,
    user: '65a20669a8073605744bec3b',
    _id: '65a20a457393a4b92d18097f',
    __v: 0
  },
  {
    title: 'Voyage to Mars',
    author: 'H.P. Lovecraft',
    url: 'https://wired.com/mars.html',
    likes: 10,
    user: '65a20fbb4a63537c1945e81b',
    _id: '65a210244a63537c1945e821',
    __v: 0
  },
  {
    title: 'Crab Inmortality',
    author: 'Jorge Gerjo',
    url: 'https://marinesea.com/studies.html',
    likes: 9,
    user: '65a20669a8073605744bec3b',
    _id: '65a20d45f0e80d516dbf802f',
    __v: 0
  },
  {
    title: 'Wonders of Nature',
    author: 'J.P Leon',
    url: 'https://kkakaka.com/kakish.html',
    likes: 8,
    user: '65a20fbb4a63537c1945e81b',
    _id: '65a2eb280e53cc8817092df9',
    __v: 0
  }
]

const initialUsers = [
  {
    username: 'maskkaka',
    name: 'Mask Kaka',
    passwordHash: '$2b$10$C.w81oZjooppCmv1VVjVTOI2gZq6QRzPK5irnEU1ZN7ucnDan5keG',
    blogs: [
      '65a20a457393a4b92d18097f', '65a20d45f0e80d516dbf802f'
    ],
    id: '65a20669a8073605744bec3b'
  },
  {
    username: 'elonspice',
    name: 'Elon Spice',
    passwordHash: '$2b$10$UebO/Pt04e2fm5/yU5HC2uve72Qa.Vk.HvzQVnfsPbOszdzYQcJ92',
    blogs: [
      '65a210244a63537c1945e821', '65a2eb280e53cc8817092df9'
    ],
    id: '65a20fbb4a63537c1945e81b'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb
}