document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.getElementById('form-container')
  const imgInput = document.getElementById('img')
  const topTextInput = document.getElementById('top-text')
  const bottomTextInput = document.getElementById('bottom-text')
  const createMemeButton = document.getElementById('create-meme')
  const memeContainer = document.getElementById('meme-container')

  // meme storage key
  const MEME_STORAGE_KEY = 'memes'

  // Load memes from localStorage
  let memes = JSON.parse(localStorage.getItem(MEME_STORAGE_KEY)) || []

  // reset button
  const resetButton = document.createElement('button')
  resetButton.textContent = 'Reset All'
  resetButton.id = 'reset-button' // Give it an ID
  resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all memes?')) {
      memes = [] // clear memes array
      localStorage.removeItem(MEME_STORAGE_KEY) // clear local storage
      renderMemes() // Call renderMemes() to update button visibility
    }
  })
  document.body.insertBefore(resetButton, memeContainer) // add reset button to page

  renderMemes() // Display any existing memes

  createMemeButton.addEventListener('click', () => {
    const imageUrl = imgInput.value
    const topText = topTextInput.value
    const bottomText = bottomTextInput.value

    if (!imageUrl) {
      alert('Please enter an image URL.')
      return
    }

    //   Preload image to check if it's valid and handle potential CORS issues
    const img = new Image()
    img.crossOrigin = 'anonymous' // Important for CORS if needed
    img.onload = () => {
      const meme = {
        imageUrl: imageUrl,
        topText: topText,
        bottomText: bottomText,
      }

      memes.push(meme)
      localStorage.setItem(MEME_STORAGE_KEY, JSON.stringify(memes))
      renderMemes() //Update the display
      formContainer.reset() // Clear the form inputs
    }
    img.onerror = () => {
      alert(
        "Error loading image. Please check the url and ensure it's publicly accessible."
      )
    }
    img.src = imageUrl // Start loading the image
  })

  function renderMemes() {
    memeContainer.innerHTML = '' // Clear previous memes
    memes.forEach((meme, index) => {
      const memeDiv = document.createElement('div')
      memeDiv.classList.add('meme')

      const image = document.createElement('img')
      image.src = meme.imageUrl
      image.alt = 'Meme Image'

      const topText = document.createElement('div')
      topText.classList.add('top-text')
      topText.textContent = meme.topText

      const bottomText = document.createElement('div')
      bottomText.classList.add('bottom-text')
      bottomText.textContent = meme.bottomText

      memeDiv.appendChild(image)
      memeDiv.appendChild(topText)
      memeDiv.appendChild(bottomText)

      // delete meme button
      const deleteButton = document.createElement('button')
      deleteButton.innerHTML = '&times;' // Use times symbol for "x"
      deleteButton.classList.add('delete-button')
      deleteButton.addEventListener('click', () => {
        memes.splice(index, 1) //Remove meme from array
        localStorage.setItem(MEME_STORAGE_KEY, JSON.stringify(memes))
        renderMemes() //Re-render memes
      })
      memeDiv.appendChild(deleteButton) // Add delete button to meme

      memeContainer.appendChild(memeDiv)
    })
    // Show/hide reset button
    resetButton.style.display = memes.length > 0 ? 'block' : 'none'
  }
})
