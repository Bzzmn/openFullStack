const { name } = require("../app")
const { init } = require("../models/user")

const initialBlogs = [
    {
        title: "Voyage to Mars",
        author: "J. Lovecraft",
        url: "https://wired.com/mars.html",
        likes: 5
    },
    {
        title: "The Moon Chronicles",
        author: "Joan Reno",
        url: "https://wired.com/moon.html",
        likes: 3
    },
    {
        title: "The Black Hole",
        author: "Joan Reno",
        url: "https://wired.com/black-hole.html",
        likes: 2
    },
    {
        title: "The Sun and the Stars",
        author: "Cartes Descartes",
        url: "https://wired.com/sun.html",
        likes: 8
    }, 
    {
        title: "The Milky Way",
        author: "Cartes Descartes",
        url: "https://wired.com/milky-way.html",
        likes: 3
    }, 
    {
        title: "The Universe",
        author: "Cartes Descartes",
        url: "https://wired.com/universe.html",
        likes: 1
    }
]

const initialUsers = [
    {
        username: "cdescartes",
        name: "Cartes Descartes",
        password: "password_descartes"
    },
    {
        username: "jlovecraft",
        name: "J. Lovecraft",
        password: "password_jlovecraft",
    }, 
    {
        username: "jreno",
        name: "Joan Reno",
        password: "password_jreno"
    }
]

module.exports = { initialBlogs, initialUsers }