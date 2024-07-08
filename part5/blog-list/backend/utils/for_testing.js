const reverse = (str) => {
    return str.split('').reverse().join('')
}

const average = (arr) => {
    const reducer = (acc, item) => {
        return acc + item
    }
    return arr.length === 0 ? 0 : arr.reduce(reducer, 0) / arr.length
}

module.exports = { reverse, average }