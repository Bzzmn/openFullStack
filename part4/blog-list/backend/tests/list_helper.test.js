const { test, describe } = require('node:test') 
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        "_id": "668872f397361643f681ab76",
        "title": "My first blog",
        "author": "John Doe",
        "url": "http://www.johndoe.com",
        "likes": 5,
        "__v": 0
      }
]

const listWithManyBlogs = [
    {
        "_id": "65d53af4ae46dbfa04376f43",
        "title": "la ultima",
        "author": "Koka Kokos",
        "url": "Koka.cl",
        "likes": 6,
        "__v": 0
      },
      {
        "_id": "668872f397361643f681ab76",
        "title": "My first blog",
        "author": "John Doe",
        "url": "http://www.johndoe.com",
        "likes": 3,
        "__v": 0
      }, 
      {
        "_id": "668872f397361643f681ab77",
        "title": "My second blog",
        "author": "John Doe",
        "url": "http://www.johndoe.com",
        "likes": 2,
        "__v": 0
      }, 

]


describe ('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equal the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has many blogs equal the likes of all', () => {
        const result = listHelper.totalLikes(listWithManyBlogs)
        assert.strictEqual(result, 11)
    })
});


describe('favorite blog', () => {
    test('of empty list is zero', () => {
        const result = listHelper.favoriteBlog([])
        assert.deepStrictEqual(result, {})
    })

    test('when list has only one blog equal the likes of that', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, {
            title: "My first blog",
            author: "John Doe",
            likes: 5
        })
    })

    test ('when list has many blogs equal the most liked', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        assert.deepStrictEqual(result, {
            title: "la ultima",
            author: "Koka Kokos",
            likes: 6
        })
    })
});

describe('most prolific author', () => {
    test('of empty list is zero', () => {
        const result = listHelper.mostBlogs([])
        assert.deepStrictEqual(result, {})
    })

    test('when list has only one blog equal the author of that', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: "John Doe",
            blogs: 1
        })
    })

    test('when list has many blogs equal the author with most blogs', () => {
        const result = listHelper.mostBlogs(listWithManyBlogs)
        assert.deepStrictEqual(result, {
            author: "John Doe",
            blogs: 2
        })
    })
});

describe('most liked author', () => {
    test('of empty list is zero', () => {
        const result = listHelper.mostLikes([])
        assert.deepStrictEqual(result, {})
    })

    test('when list has only one blog equal the author of that', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: "John Doe",
            likes: 5
        })
    })

    test('when list has many blogs equal the author with most likes', () => {
        const result = listHelper.mostLikes(listWithManyBlogs)
        assert.deepStrictEqual(result, {
            author: "Koka Kokos",
            likes: 6
        })
    })        
});

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
});


