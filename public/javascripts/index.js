import sweetAlert from '../helper/sweetAlert.js'
import serverUrl from '../serverUrl.js'

class Model {
  constructor() {
    this.currentVideo = {
      title: '',
      comments: []
    }
    this.channels = []
    this.videoMap = new Map()
  }
  getLocalChannels = () => {
    this.channels = JSON.parse(localStorage.getItem('channels')) || []
    return this.channels
  }
  addLocalChannel = (channelData) => {
    // get storage data to check exist channel
    const storageData = JSON.parse(localStorage.getItem('channels'))
    let newArray = []

    if (storageData && storageData.length > 0) {
      // check if channel exist
      const currentChannel = storageData.find((channel) => {
        return channel.channelId === channelData.channelId
      })
      if (currentChannel) {
        sweetAlert.notice('Channel Already Exist')
        return
      }
      newArray = [...storageData, channelData]
      sweetAlert.success('Channel Added', '', 2000)
    } else {
      newArray = [channelData]
    }
    localStorage.setItem('channels', JSON.stringify(newArray))
    this.channels = JSON.stringify(newArray)
    return this.channels
  }
  async getComments(url) {
    try {
      if (!url) throw new Error('Missing youtube url')

      // get comments
      const response = await fetch(serverUrl + `/api/comments/?url=${url}`)
      const json = await response.json()
      if (!json.ok) throw new Error(json.error)

      this.currentVideo = {
        videoId: json.data.videoId,
        title: json.data.title,
        comments: json.data.comments
      }
      return true
    } catch (err) {
      sweetAlert.error('Fail', err.message)
      return false
    }
  }
  async getChannelId(url) {
    if (!url) throw new Error('Missing youtube url')

    // get channelId
    const response = await fetch(serverUrl + `/api/channelId/?url=${url}`)
    const json = await response.json()
    if (!json.ok) throw new Error(json.error)
    const channelId = json.data.channelId

    return channelId
  } catch(err) {
    sweetAlert.error('Fail', err.message)
    return false
  }
  async getChannelData(channelId) {
    if (!channelId) throw new Error('Missing channel id')

    // get channel Id
    const response = await fetch(serverUrl + `/api/channelData/?channelId=${channelId}`)
    const json = await response.json()
    if (!json.ok) throw new Error(json.error)
    const channelData = json.data.channelData

    return channelData
  } catch(err) {
    sweetAlert.error('Fail', err.message)
    return false
  }
  // get recent videos
  async getVideos(channelId, maxResult = 5) {
    if (!channelId) throw new Error('Missing channel id')

    // get channel Id
    const response = await fetch(serverUrl + `/api/videos/?channelId=${channelId}&maxResult=${maxResult}`)
    const json = await response.json()
    if (!json.ok) throw new Error(json.error)
    const videos = json.data.videos
    return videos
  } catch(err) {
    sweetAlert.error('Fail', err.message)
    return false
  }
}

class View {
  renderYoutubeVideo(videoId) {
    const youtubeDiv = document.querySelector('#youtube')
    youtubeDiv.style.display = 'block'
    youtubeDiv.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  }
  renderVideoTitle(title) {
    const titleElement = document.querySelector('#video-title')
    titleElement.innerText = title
  }
  renderComments(comments, handler) {
    const commentsList = document.querySelector('#comments-list')
    commentsList.innerHTML = ''

    const commentsCount = document.querySelector('#comment-count')
    commentsCount.innerText = comments.length || 0

    comments.forEach(item => {
      const commentItem = document.createElement('div')
      commentItem.innerText = item.name
      commentItem.className = 'comment-item'
      commentsList.appendChild(commentItem)

      // handler
      if (handler) {
        commentItem.dataset.name = item.name
        commentItem.dataset.comment = item.comment
        commentItem.onclick = handler

      }
    });
  }
  renderWinnerTitle(winner) {
    const winnerName = document.querySelector('#winner-name')
    winnerName.innerText = winner?.name || ''
  }
  renderWinnerComment(winner) {
    const winnerComment = document.querySelector('#winner-comment')
    winnerComment.innerText = winner?.comment || ''
  }
  toggleCommentListAndPickBtn(isOn) {
    const commentAndPickDiv = document.querySelector('#comment-and-pick-div')
    if (isOn) {
      commentAndPickDiv.style.display = 'block'
    } else {
      commentAndPickDiv.style.display = 'none'
    }
  }
  submitBtnLoading(isLoading) {
    const submitButton = document.querySelector('#url-submit')
    if (isLoading) {
      submitButton.innerHTML = `
      <i class="button-icon loading-icon fa-solid fa-spinner"></i>`
      submitButton.disabled = true
    } else {
      submitButton.innerHTML = `
      <i class="button-icon fa-solid fa-magnifying-glass"></i>`
      submitButton.disabled = false

    }
  }
  toggleShowWinnerButton(isOn) {
    const showWinnerDiv = document.querySelector('#show-winner-div')
    if (isOn) {
      showWinnerDiv.style.display = 'block'
    } else {
      showWinnerDiv.style.display = 'none'
    }
  }
  renderChannelFolder(channels) {
    sweetAlert.channelFolder(channels)
  }
  // replace button's 'i' element with loading icon
  buttonLoading(button) {
    const oldIcon = button.querySelector('i')
    // set loading icon
    button.innerHTML = '<i class="fa-solid fa-spinner loading-icon"></i>'
    function resetButton() {
      button.innerHTML = ''
      button.appendChild(oldIcon)
    }
    return resetButton
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
  init() {
    this.model.getLocalChannels() // get localStorage channel
    this.setupListeners()
    this.view.toggleCommentListAndPickBtn(false)
  }
  setupListeners() {
    const urlInput = document.querySelector('#url-input')
    const submitBtn = document.querySelector('#url-submit')
    const resetBtn = document.querySelector('#url-reset')
    const pickWinnerBtn = document.querySelector('#pick-winner')
    const addChannelBtn = document.querySelector('#add-channel')
    const folderBtn = document.querySelector('#open-folder')

    submitBtn.onclick = () => this.getCommentsHandler(urlInput.value)
    resetBtn.onclick = this.resetInputHandler
    pickWinnerBtn.onclick = () => this.pickWinnerHandler()
    addChannelBtn.onclick = (e) => this.addChannelHandler(e)
    folderBtn.onclick = () => this.folderHandler()
  }
  async getCommentsHandler(url) {
    try {
      // reset old winner (if any)
      this.resetWinner()

      // deal with extra text in url (if any)
      let newUrl = ''
      if (url.includes('youtu.be')) {
        let youtubeApp = 'https://youtube.be/'
        const urlArray = url.split('/')
        const id = urlArray[urlArray.length - 1]
        newUrl = youtubeApp + id
      }

      this.view.submitBtnLoading(true)
      const ok = await this.model.getComments(newUrl || url)
      if (ok) {
        this.view.submitBtnLoading(false)
        this.view.renderComments(this.model.currentVideo.comments, this.commentOnClickHandler)
        this.view.renderVideoTitle(this.model.currentVideo.title)
        this.view.renderYoutubeVideo(this.model.currentVideo.videoId)
        this.view.toggleCommentListAndPickBtn(true)
      }
    } finally {
      this.view.submitBtnLoading(false)
    }
  }
  resetInputHandler() {
    const urlInput = document.querySelector('#url-input')
    urlInput.value = ''
  }
  pickWinnerHandler = () => {
    try {
      // reset old winner
      this.resetWinner()

      const view = this.view
      if (!this.model.currentVideo.title) throw new Error('Missing youtube video')
      if (this.model.currentVideo.comments?.length === 0) throw new Error('No comments to pick from')

      // randomly pick a user
      const comments = this.model.currentVideo.comments
      let currentWinner = null

      function pickRandomUser(comments, view) {
        const randomNumber = Math.floor(Math.random() * comments.length)
        currentWinner = comments[randomNumber]
        view.renderWinnerTitle(currentWinner)
      }

      const howManyTimes = 10
      const timeBetween = 100

      let count = 1
      const interval = setInterval(
        () => {
          if (count === howManyTimes) {
            clearInterval(interval)
            this.view.renderWinnerComment(currentWinner)
            // toggleShowWinnerButton
            this.view.toggleShowWinnerButton(true)
            // handle show winner button
            document.querySelector('#show-winner').onclick = () => {
              this.showWinnerButtonHandler(currentWinner)
            }
            return
          }
          pickRandomUser(comments, view)
          count++
        },
        timeBetween
      )

    } catch (err) {
      sweetAlert.error('Fail', err.message)
    }
  }
  commentOnClickHandler = (e) => {
    const target = e.target
    sweetAlert.youtubeComment(target.dataset.name, target.dataset.comment)
  }
  showWinnerButtonHandler(winner) {
    sweetAlert.winnerComment(winner.name, winner.comment)
  }
  resetWinner() {
    this.view.renderWinnerTitle()
    this.view.renderWinnerComment()
    this.view.toggleShowWinnerButton(false)
  }
  addChannelHandler = async (e) => {
    // button loading
    const button = document.querySelector('#add-channel')
    const resetButtonFnc = this.view.buttonLoading(button)
    try {
      const input = document.querySelector('#url-input')
      if (!input || !input.value) throw new Error('Missing video url')

      // get channel id | channel data
      const channelID = await this.model.getChannelId(input.value)
      const channelData = await this.model.getChannelData(channelID)

      // button reset
      resetButtonFnc()

      // render channel preview
      const result = await sweetAlert.addChannelPreview(channelData)
      // confirm to add channel
      if (result.isConfirmed) {
        // add channel to local storage
        this.model.addLocalChannel(channelData)
      }

    } catch (err) {
      sweetAlert.error('Fail', err.message)
    } finally {
      resetButtonFnc()
    }
  }
  folderHandler = async () => {
    this.model.getLocalChannels()
    const channels = this.model.channels
    this.view.renderChannelFolder(channels)

    // handler for swal-channel-item
    const channelItems = document.querySelectorAll('.swal-channel-item')
    if (channelItems) {
      channelItems.forEach(item => {
        item.onclick = (e) => {
          this.channelItemHandler(e, item)
        }
      })
    }

    // remove channel button
    const removeChannelBtns = document.querySelectorAll('.remove-channel-btn')
    if (removeChannelBtns) {
      removeChannelBtns.forEach(btn => {
        const channelId = btn.dataset.channelId
        btn.onclick = async (e) => {
          e.preventDefault()
          e.stopPropagation()
          // confirm delete
          const result = await sweetAlert.confirm('Remove Channel')
          if (result.isConfirmed) {
            // remove channel
            const channels = this.model.channels
            const index = channels.findIndex(channel => channel.channelId === channelId)
            channels.splice(index, 1)
            // set local channel
            localStorage.setItem('channels', JSON.stringify(channels))
            this.model.getLocalChannels()

            // render new folder
            this.folderHandler()
          }
        }
      })
    }
  }
  // onclick use channel id to get recent videos of the channel
  channelItemHandler = async (e, channelItem) => {
    try {
      e.stopPropagation()

      // if item is active, close item and return
      if (channelItem.classList.contains('active')) {
        channelItem.classList.remove('active')
        return
      } else {
        // start loading
        channelItem.classList.add('loading')
      }

      // get video
      const channelId = channelItem.querySelector('.swal-channel-preview').dataset.channelId
      let videos = this.model.videoMap.get(channelId)
      // check if video exist in model.videoMap
      if (!videos) {
        videos = await this.model.getVideos(channelId)
        this.model.videoMap.set(channelId, videos)
      }
      if (!videos) throw new Error('Can not find any videos')

      // render videos
      // hide all channel item
      document.querySelectorAll('.swal-channel-item').forEach(item => {
        item.classList.remove('active')
      })
      const videoList = channelItem.querySelector('.video-list')
      if (videoList) {
        // render videos in list
        const videoArray = videos.map(video => {
          return `
            <div class='list-item' data-video-id=${video.videoId}>
              <div class='thumbnail'>
                <img src=${video.thumbnail.url}>
              </div>
              <div class='info'>
                <p class='title'>${video.title}</p>
                <p class='date'>${video.publishedAt}</p>
              </div>
            </div>
          `
        })
        videoList.innerHTML = videoArray.join('')
        channelItem.classList.add('active')
      }

      // video list item handler
      const videoItems = document.querySelectorAll('.list-item')
      if (videoItems) {
        videoItems.forEach(item => item.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          const videoID = e.target.dataset.videoId
          const urlInput = document.querySelector('#url-input')
          if (urlInput) urlInput.value = `https://www.youtube.com/watch?v=${videoID}`
          // close swal
          sweetAlert.close()
          // search
          document.querySelector('#url-submit').click()
        })
      }
    } catch (err) {
      sweetAlert.error('Fail', err)
      channelItem.classList.remove('loading')
    } finally {
      channelItem.classList.remove('loading')
    }
  }
}

const model = new Model()
const view = new View()
const controller = new Controller(model, view)
controller.init()
