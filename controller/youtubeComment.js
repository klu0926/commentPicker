const getYouTubeID = require('get-youtube-id');
const responseJSON = require('../helper/responseJSON')

const youtubeVideoInfoAPI = (videoId) => {
  const API_KEY = process.env.YOUTUBE_API_KEY
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
  return url
}

const youtubeCommentAPI = (videoId, maxResult = 1000) => {
  const API_KEY = process.env.YOUTUBE_API_KEY
  return `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${maxResult}&order=time&videoId=${videoId}&key=${API_KEY}`
}


const youtubeComment = {
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


      // correct function here 
      const url = req.query.url
      if (!url) throw new Error('No url')

      // get youtube video id
      const videoId = getYouTubeID(url)
      if (!videoId) throw new Error('Can not find youtube video id')

      // get info
      const infoResponse = await fetch(youtubeVideoInfoAPI(videoId))
      const infoData = await infoResponse.json()
      if (!infoData.items) throw new Error('Can not find youtube info')
      // get title
      const title = infoData.items[0].snippet.title;

      // get video comments
      const commentsResponse = await fetch(youtubeCommentAPI(videoId))
      const commentsData = await commentsResponse.json()
      if (!commentsData.items) throw new Error('Can not find youtube comments')
      const comments = commentsData.items.map(item => {
        return {
          name: item.snippet.topLevelComment.snippet.authorDisplayName,
          comment: item.snippet.topLevelComment.snippet.textOriginal
        }
      })

      const response = responseJSON(true, resource, action, {
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