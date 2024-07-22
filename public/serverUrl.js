const isLocal = window.location.hostname === 'localhost';
const heroku = 'https://comment-picker-2755d12b5505.herokuapp.com'
const local = 'http://localhost:3000'

const server = isLocal ? local : heroku

export default server