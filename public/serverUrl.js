const isLocal = window.location.hostname === 'localhost';
const heroku = 'heroku url here'
const local = 'http://localhost:3000'

const server = isLocal ? local : heroku

export default server