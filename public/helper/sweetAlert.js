const sweetAlert = {
  didRenderHandlers: {}, // for write controller to set up later
  success: (title, text, timer) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title || "Success!",
        icon: "success",
        text: text || '',
        showConfirmButton: false,
        timer: timer || 1500,
        customClass: {
          title: 'swal-title',
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  notice: (title, icon, text) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title || "Success!",
        icon: icon || "info",
        text: text || '',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3894F1',
        customClass: {
          title: 'swal-title',
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  // {isConfirmed: true, isDenied: false, isDismissed: false, value: true}
  confirm: (title, text) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        text: text || '',
        confirmButtonText: 'Yes',
        confirmButtonColor: '#3894F1',
        showDenyButton: true,
        denyButtonText: 'No',
        denyButtonColor: '#F7647D',
        customClass: {
          title: 'swal-title',
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  error: (title, text) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title || 'Fail',
        icon: "error",
        text: text || '',
        confirmButtonText: 'OK',
        confirmButtonColor: '#F7647D',
        customClass: {
          title: 'swal-title',
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  editTagInput: (title, inputValue, placeholder, inputType) => {
    return new Promise(async (resolve, reject) => {
      const result = await Swal.fire({
        title: title || 'title',
        input: inputType || "text",
        inputPlaceholder: placeholder,
        inputValue,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3894F1',
        showDenyButton: true,
        denyButtonText: 'Deny',
        denyButtonColor: '#F7647D',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        inputAttributes: {
          "aria-label": "Type your input here"
        },
        customClass: {
          title: 'swal-title',
        }
      })
      resolve(result)
    })
  },
  image: (url, size) => {
    Swal.fire({
      showConfirmButton: false,
      showCancelButton: false,
      cancelButtonText: 'Close',
      imageWidth: size || '320px',
      background: `#fff`,
      imageUrl: url,
      customClass: {
        popup: 'swal-preview-popup',
      }
    })
  },
  loading: (loadTitle) => {
    Swal.fire({
      title: loadTitle || "Loading...",
      html: `<div class='swal-loading-bar'></div>`,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        title: 'swal-loading-title',
        popup: 'swal-loading-popup',
        text: 'swal-loading-text'
      }
    })
    // return a close now function
    return sweetAlert.closeNow
  },
  // sync 
  closeNow: () => {
    const alert = document.querySelector('.swal2-container')
    if (alert) {
      swal.close()
    }
  },
  // timeout
  close: (timer = 0) => {
    setTimeout(() => {
      const alert = document.querySelector('.swal2-container')
      if (alert) {
        swal.close()
      }
    }, timer)
  },
  youtubeComment: (title, text) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        html: `
        <div class='swal-comment'>
        <i class="fa-regular fa-comment-dots"></i>
        <h3>${title}</h3>
         <div class='swal-comment-text'>
          <p>${text}</p>
          </div>
         </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
          title: 'swal-comment-title',
          text: 'swal-comment-text',
          closeButton: 'swal-close'
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  winnerComment: (title, text) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        html: `
        <div class='swal-comment'>
        <i class="fa-solid fa-crown"></i>
        <h3>${title}</h3>
        <div class='swal-comment-text'>
          <p>${text}</p>
          </div>
        </div>
        `,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
          title: 'swal-comment-title',
          text: 'swal-comment-text',
          closeButton: 'swal-close'
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  addChannelPreview: (channelData) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        html: `
        <div class='swal-channel-preview'>
          <div class='thumbnail'>
            <img src=${channelData.thumbnail.url}>
          </div>
          <div class='info'>
            <p class='title'>${channelData.title}</p>
            <p class='handle'>${channelData.handle}</p>
            <p class='description'>${channelData.description}</p>
            </div>
        </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Add Channel',
        confirmButtonColor: '#3894F1',
        showDenyButton: true,
        denyButtonText: 'No',
        denyButtonColor: '#F7647D',
        customClass: {
          title: 'swal-comment-title',
          text: 'swal-comment-text',
          closeButton: 'swal-close'
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
  channelFolder: (channels) => {
    return new Promise((resolve, reject) => {
      let channelsDiv = null
      if (!channels || channels.length === 0) {
        channelsDiv = [`<p class='folder-empty'>Folder Empty</p>`]
      } else {
        channelsDiv = channels.map(channel =>
          `<div class='swal-channel-item'>
          <div class='swal-channel-preview' data-channel-id=${channel.channelId} >
              <div class='thumbnail'>
                <img src=${channel.thumbnail.url}>
              </div>
              <div class='info'>
                <p class='title'>${channel.title}</p>
                <p class='handle'>${channel.handle}</p>
              </div>
              <button class='btn btn-danger remove-channel-btn' data-channel-id=${channel.channelId}>
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class='video-list'></div>
        </div>`
        )
      }

      Swal.fire({
        html: `
        <div class='swal-channel-folder'>
          ${channelsDiv.join('')}
        </div>
        `,
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: true,
        customClass: {
          title: 'swal-comment-title',
          text: 'swal-comment-text',
          closeButton: 'swal-close'
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
}

export default sweetAlert