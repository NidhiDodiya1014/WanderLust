// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initAnimations()

  // Initialize 3D effects
  init3DEffects()

  // Initialize scroll effects
  initScrollEffects()

  // Initialize search functionality
  initSearch()

  // Initialize form validations
  initFormValidations()
})

// Animation initialization
function initAnimations() {
  // Animate cards on scroll
  const cards = document.querySelectorAll(".card")

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add show class with a delay based on index
          setTimeout(() => {
            entry.target.classList.add("show")
          }, Array.from(cards).indexOf(entry.target) * 100)

          // Stop observing after animation
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  // Observe each card
  cards.forEach((card) => {
    observer.observe(card)
  })

  // Add floating animation to specific elements
  document.querySelectorAll(".float").forEach((el) => {
    // Randomize the animation delay
    el.style.animationDelay = `${Math.random() * 2}s`
  })
}

// 3D effects initialization
function init3DEffects() {
  // Tilt effect for cards
  const cards = document.querySelectorAll(".tilt-card")

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    })
  })

  // Initialize Three.js scene if available
  const THREE = window.THREE // Declare the THREE variable
  if (typeof THREE !== "undefined" && document.getElementById("bg-scene")) {
    initThreeJsScene()
  }
}

// Scroll effects initialization
function initScrollEffects() {
  // Parallax scrolling effect
  const parallaxElements = document.querySelectorAll(".parallax")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset

    parallaxElements.forEach((el) => {
      const speed = el.dataset.speed || 0.5
      el.style.transform = `translateY(${scrollTop * speed}px)`
    })

    // Update scroll progress bar
    const scrollProgress = document.querySelector(".scroll-progress")
    if (scrollProgress) {
      const scrollPercent = (scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100
      scrollProgress.style.width = `${scrollPercent}%`
    }
  })
}

// Search functionality
function initSearch() {
  const searchInput = document.querySelector(".search-input")
  if (!searchInput) return

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const cards = document.querySelectorAll(".card")

    cards.forEach((card) => {
      const title = card.querySelector(".card-title").textContent.toLowerCase()
      const location = card.querySelector(".card-location").textContent.toLowerCase()
      const description = card.querySelector(".card-description").textContent.toLowerCase()

      if (title.includes(searchTerm) || location.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })
  })
}

// Form validations
function initFormValidations() {
  const form = document.querySelector("form")
  if (!form) return

  form.addEventListener("submit", (e) => {
    let isValid = true

    // Validate required fields
    const requiredFields = form.querySelectorAll("[required]")
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false
        field.classList.add("error")

        // Add error message if not exists
        let errorMsg = field.parentNode.querySelector(".error-message")
        if (!errorMsg) {
          errorMsg = document.createElement("div")
          errorMsg.className = "error-message"
          errorMsg.textContent = "This field is required"
          errorMsg.style.color = "var(--danger)"
          errorMsg.style.fontSize = "0.8rem"
          errorMsg.style.marginTop = "0.25rem"
          field.parentNode.appendChild(errorMsg)
        }
      } else {
        field.classList.remove("error")
        const errorMsg = field.parentNode.querySelector(".error-message")
        if (errorMsg) {
          errorMsg.remove()
        }
      }
    })

    // Validate price field if exists
    const priceField = form.querySelector('input[name="price"]')
    if (priceField && priceField.value) {
      const price = Number.parseFloat(priceField.value)
      if (isNaN(price) || price <= 0) {
        isValid = false
        priceField.classList.add("error")

        // Add error message if not exists
        let errorMsg = priceField.parentNode.querySelector(".error-message")
        if (!errorMsg) {
          errorMsg = document.createElement("div")
          errorMsg.className = "error-message"
          errorMsg.textContent = "Please enter a valid price"
          errorMsg.style.color = "var(--danger)"
          errorMsg.style.fontSize = "0.8rem"
          errorMsg.style.marginTop = "0.25rem"
          priceField.parentNode.appendChild(errorMsg)
        }
      }
    }

    if (!isValid) {
      e.preventDefault()
    }
  })

  // Clear error on input
  const formInputs = form.querySelectorAll("input, textarea")
  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error")
      const errorMsg = input.parentNode.querySelector(".error-message")
      if (errorMsg) {
        errorMsg.remove()
      }
    })
  })
}

// Three.js background scene
function initThreeJsScene() {
  // Create scene
  const scene = new window.THREE.Scene() // Use window.THREE

  // Create camera
  const camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  // Create renderer
  const renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  document.getElementById("bg-scene").appendChild(renderer.domElement)

  // Create particles
  const particlesGeometry = new window.THREE.BufferGeometry()
  const particlesCount = 2000

  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute("position", new window.THREE.BufferAttribute(posArray, 3))

  // Create material
  const particlesMaterial = new window.THREE.PointsMaterial({
    size: 0.02,
    color: 0x2563eb,
    transparent: true,
    opacity: 0.8,
  })

  // Create points
  const particlesMesh = new window.THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    particlesMesh.rotation.x += 0.0005
    particlesMesh.rotation.y += 0.0005

    renderer.render(scene, camera)
  }

  animate()

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}
