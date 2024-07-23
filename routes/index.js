const route = require('express').Router()
const youtubeController = require('../controller/youtubeController')
const responseJSON = require('../helper/responseJSON')

// pages
route.get('/', (req, res, next) => {
  res.redirect('/pages/index.html')
})

// api
route.get('/api/comments', youtubeController.getComments)
route.get('/api/channelId', youtubeController.getChannelId)
route.get('/api/channelData', youtubeController.getChannelData)
route.get('/api/videos', youtubeController.getVideos)

// error handler in the end of all routes
// error params is the 1st when having 4 params
route.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json(responseJSON(false, err.resource, err.action, null, null, err.error))
})

module.exports = route