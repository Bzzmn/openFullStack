const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Blog = require('./models/blog')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://alvaroacevedoing:${password}@cluster0.om8br5c.mongodb.net/testBlogList?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const blog = new Blog({
  title: 'HTML is easy',
  author: 'Alvaro Acevedo',
  url: 'www.alvaroacevedo.com',
  likes: 5
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})