
const totalLikes = (blogs) => {
  let total = 0
  for(let i = 0; i < blogs.length; i++){
    total = total + blogs[i].likes
  }
  return total
}

const favoriteBlog = (blogs) => {
  let max = blogs[0]
  for(let i = 0; i < blogs.length; i++){
    if(blogs[i].likes > max.likes){
      max = blogs[i]
    }
  }
  return max
}

const findMostProlificAuthor = (blogs) => {
  const authorCounts = {}

  blogs.forEach(blog => {
    if (!authorCounts[blog.author]) {
      authorCounts[blog.author] = 0
    }
    authorCounts[blog.author]++
  })

  let mostProlificAuthor = ''
  let maxBlogs = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      mostProlificAuthor = author
      maxBlogs = authorCounts[author]
    }
  }

  return {
    author: mostProlificAuthor,
    blogs: maxBlogs
  }
}

const findMostLikedAuthor = (blogs) => {
  const authorLikes = {}
  blogs.forEach(blog => {
    if(!authorLikes[blog.author]){
      authorLikes[blog.author] = 0
    }
    authorLikes[blog.author] += blog.likes
  })

  let mostLikedAuthor = ''
  let maxLikes = 0

  for(const author in authorLikes){
    if(authorLikes[author] > maxLikes){
      mostLikedAuthor = author
      maxLikes = authorLikes[author]
    }
  }
  return {
    author: mostLikedAuthor,
    likes: maxLikes
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  findMostProlificAuthor,
  findMostLikedAuthor
}