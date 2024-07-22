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
  confirm: (title, text) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        text: text || '',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#3894F1',
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
        <p>${text}</p>
        </div>
        `,
        showConfirmButton: false,
        customClass: {
          title: 'swal-comment-title',
          text: 'swal-comment-text',
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
        <p>${text}</p>
        </div>
        `,
        showConfirmButton: false,
        customClass: {
          title: 'swal-comment-title',
          text: 'swal-comment-text',
        }
      }).then(result => {
        return resolve(result)
      })
    })
  },
}

export default sweetAlert