const getYouTubeID = require('get-youtube-id');
const youtubeAPI = require('./youtubeAPI')
const responseJSON = require('../helper/responseJSON')


const youtubeComment = {
  // get channel id with any video page
  // query: url
  getChannelId: async (req, res, next) => {
    const resource = 'channel'
    const action = 'get'
    try {
      const url = req.query?.url
      if (!url) throw new Error('Missing query youtube url')
      const channelId = await youtubeAPI.getYoutubeChannelIdFromHTML(url)

      // response
      const response = responseJSON(true, resource, action, {
        channelId,
      })
      res.json(response)
    } catch (error) {
      next({
        resource,
        action,
        error,
      })
    }
  },
  // get channel's data with channel Id
  // query : channelId
  getChannelData: async (req, res, next) => {
    const resource = 'channel'
    const action = 'get'
    try {
      const channelId = req.query?.channelId
      if (!channelId) throw new Error('Get Channel Data : Missing channel Id')

      const channelData = await youtubeAPI.youtubeChannelAPI(channelId)
      if (!channelData) throw new Error('Get Channel Data : Can not get data')

      // response
      const response = responseJSON(true, resource, action, {
        channelData,
      })
      res.json(response)
    } catch (error) {
      next({
        resource,
        action,
        error,
      })
    }
  },
  // get most recent videos from channel id
  // query: channelId, maxResult?
  getVideos: async (req, res, next) => {
    const resource = 'videos'
    const action = 'get'
    try {
      const channelId = req.query?.channelId
      const maxResult = req.query?.maxResult || 5
      if (!channelId) throw new Error('Get Videos: Missing query channelId')

      // get playlist id
      const channelData = await youtubeAPI.youtubeChannelAPI(channelId)
      if (!channelData) throw new Error('Get Videos: Can not get channel data')
      const playlistId = channelData.playlistId
      if (!playlistId) throw new Error('Get Videos: Can not get playlist id')

      // get videos
      const videos = await youtubeAPI.youtubePlaylistAPI(playlistId, maxResult)

      // response
      const response = responseJSON(true, resource, action, {
        videos,
      })
      res.json(response)
    } catch (error) {
      next({
        resource,
        action,
        error,
      })
    }
  },
  getComments: async (req, res, next) => {
    const resource = 'comments'
    const action = 'get'
    try {

      // // use dummy data for setup
      // const dummyComments = []
      // const dummyTitle = '這是一個假的影片，可以很長，也可以很短！把名稱用超長一點點吧！「超級棒棒」[開箱]'

      // // create dummy data
      // for (let i = 1; i < 100; i++) {
      //   dummyComments.push({
      //     name: `使用者${i}`,
      //     comment: '講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～講了很多很多很棒棒的話～'
      //   })
      // }
      // const dummyResponse = responseJSON(true, resource, action, {
      //   title: dummyTitle,
      //   comments: dummyComments
      // })

      // // loading time
      // const waitTime = 2000
      // const promise = new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve()
      //   }, waitTime)
      // })
      // await promise // wait for 2 second
      // res.json(dummyResponse)
      // return


      // ----------------------------------
      // correct function here 
      let url = req.query.url
      if (!url) throw new Error('No url')

      // get youtube video id
      const videoId = getYouTubeID(url)
      if (!videoId) throw new Error('Can not find youtube video id')

      // get video info
      const videoData = await youtubeAPI.youtubeVideoAPI(videoId)
      if (!videoData) throw new Error('VideoAPI: Can not get video info')
      const title = videoData.title

      // get comments
      const comments = await youtubeAPI.youtubeCommentAPI(videoId)
      if (!comments || comments.length === 0) throw new Error('CommentAPI: Can not find any comments')

      // response
      const response = responseJSON(true, resource, action, {
        videoId,
        title,
        comments
      })
      res.json(response)
    } catch (error) {
      next({
        resource,
        action,
        error,
      })
    }
  }
}





module.exports = youtubeComment