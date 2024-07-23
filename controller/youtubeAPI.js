const dayjs = require('dayjs')

// API_KEY
let API_KEY = process.env.YOUTUBE_API_KEY
if (!API_KEY) {
  require('dotenv').config()
  API_KEY = process.env.YOUTUBE_API_KEY
}

// API
const youtubeAPI = {
  getYoutubeChannelIdFromHTML: async (url) => {
    try {
      if (!url) throw new Error('Missing url')

      const html = await (await fetch(url)).text()
      const channelId = html.match(/(?<=channelId(":"|"\scontent="))[^"]+/g)[0];

      if (!channelId) throw new Error('Can not find channelId')

      // return 
      return channelId
    } catch (err) {
      throw err
    }
  },

  // get newest playlistId with channel Id (cost 1 quota)
  youtubeChannelAPI: async (channelId) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("Uploads playlist not found");
      }

      // channel data
      const snippet = data.items[0].snippet
      const channelData = {
        channelId,
        title: snippet.title,
        handle: snippet.customUrl,
        description: snippet.description,
        thumbnail: snippet.thumbnails.medium,
        viewCount: data.items[0].statistics.viewCount,
        subscriberCount: data.items[0].statistics.subscriberCount,
        videoCount: data.items[0].statistics.videoCount,
        playlistId: data.items[0].contentDetails.relatedPlaylists.uploads
      }

      // return 
      return channelData
    } catch (err) {
      throw err
    }
  },
  // get recent videos with playlist id (cost 1 quota under 50 results)
  youtubePlaylistAPI: async (playlistId, maxResults = 5) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.items) {
        throw new Error("No videos found");
      }

      // video data
      const videos = data.items.map(item => {
        return {
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelId,
          videoId: item.snippet.resourceId.videoId,
          position: item.snippet.position,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium,
          publishedAt: dayjs(item.snippet.publishedAt).format('YYYY-MM-DD')
        }
      })

      // return 
      return videos;
    } catch (err) {
      throw err
    }
  },
  youtubeVideoAPI: async (videoId) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();
      if (!data.items) throw new Error('Can not find youtube info')

      // video data
      const snippet = data.items[0].snippet
      const video = {
        channelId: snippet.channelId,
        title: snippet.title,
        description: snippet.description,
        thumbnail: snippet.thumbnails.medium
      }

      // return 
      return video
    } catch (err) {
      throw err
    }
  },
  youtubeCommentAPI: async (videoId, maxResult = 100) => {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${maxResult}&order=time&videoId=${videoId}&key=${API_KEY}`

      const response = await fetch(url)
      const data = await response.json()
      if (!data.items) throw new Error('Can not find youtube comments')

      const comments = data.items.map(item => {
        return {
          name: item.snippet.topLevelComment.snippet.authorDisplayName,
          comment: item.snippet.topLevelComment.snippet.textOriginal
        }
      })

      // return 
      return comments
    } catch (err) {
      throw err
    }

  }
}

// UCL83iW85K02HrzJ2H8NetZA  - charlulu channel Id
// UUL83iW85K02HrzJ2H8NetZA - charlulu recent playlist id
// mkw0Ak4peWc - charlulu 無印良品 video id
module.exports = youtubeAPI


