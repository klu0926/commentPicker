const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')

// for heroku
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(express.static('public'))
app.use(routes)

app.listen(port, () => {
  console.log(`Server listening on prot : ${port}`)
})