const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const result = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return {
        title: result.title,
        author: result.author,
        likes: result.likes
    }
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = _.groupBy(blogs, 'author')
    const authorBlogCounts = _.map(blogsByAuthor, (blogs, author) => ({
        author,
        blogs: blogs.length
    }))

    const topAuthor = _.maxBy(authorBlogCounts, 'blogs')
    return topAuthor || {}
}



const mostLikes = (blogs) => {
    const blogsByAuthor = _.groupBy(blogs, 'author')
    console.log(blogsByAuthor)
    const authorLikes = _.map(blogsByAuthor, (authorBlogs, author) => ({
        author,
        likes: _.sumBy(authorBlogs, 'likes')
    }))

    const topAuthorByLikes = _.maxBy(authorLikes, 'likes')
    return topAuthorByLikes || {}
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }