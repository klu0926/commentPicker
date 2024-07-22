import sweetAlert from '../helper/sweetAlert.js'
import serverUrl from '../serverUrl.js'

class Model {
  constructor() {
    this.video = {
      title: '',
      comments: []
    }
  }
  async getComments(url) {
    try {
      if (!url) throw new Error('Missing youtube url')
      // get comments
      const response = await fetch(serverUrl + `/api/comments/?url=${url}`)
      const json = await response.json()
      if (!json.ok) throw new Error(json.error)

      this.video = {
        title: json.data.title,
        comments: json.data.comments
      }
      return true
    } catch (err) {
      sweetAlert.error('Fail', err.message)
      return false
    }
  }
}


class View {
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
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
  init() {
    this.setupListeners()
    this.view.toggleCommentListAndPickBtn(false)
  }
  setupListeners() {
    const urlInput = document.querySelector('#url-input')
    const submitBtn = document.querySelector('#url-submit')
    const resetBtn = document.querySelector('#url-reset')
    const pickWinnerBtn = document.querySelector('#pick-winner')

    submitBtn.onclick = () => this.getCommentsHandler(urlInput.value)
    resetBtn.onclick = this.resetInputHandler
    pickWinnerBtn.onclick = this.pickWinnerHandler

  }
  async getCommentsHandler(url) {
    try {
      // reset old winner (if any)
      this.resetWinner()

      this.view.submitBtnLoading(true)
      const ok = await this.model.getComments(url)
      if (ok) {
        this.view.submitBtnLoading(false)
        this.view.renderComments(this.model.video.comments, this.commentOnClickHandler)
        this.view.renderVideoTitle(this.model.video.title)
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
      if (!this.model.video.title) throw new Error('Missing youtube video')
      if (this.model.video.comments?.length === 0) throw new Error('No comments to pick from')

      // randomly pick a user
      const comments = this.model.video.comments
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
}


const model = new Model()
const view = new View()
const controller = new Controller(model, view)
controller.init()


