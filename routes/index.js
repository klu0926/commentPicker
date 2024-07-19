const route = require('express').Router()
const youtubeComment = require('../controller/youtubeComment')
const responseJSON = require('../helper/responseJSON')

// pages
route.get('/', (req, res, next) => {
  res.redirect('/pages/index.html')
})

// api
route.get('/api/comments', youtubeComment.getComments)

// error handler in the end of all routes
// error params is the 1st when having 4 params
route.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json(responseJSON(false, err.resource, err.action, null, null, err.error))
})

module.exports = route