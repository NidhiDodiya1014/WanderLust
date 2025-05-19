// This file will contain the Three.js scene for the 3D background
// It's a more advanced implementation of the 3D background

// Import Three.js
const THREE = window.THREE

document.addEventListener("DOMContentLoaded", () => {
  // Check if Three.js is available
  if (typeof THREE === "undefined" || !document.getElementById("bg-scene")) return

  // Create scene
  const scene = new THREE.Scene()

  // Create camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 30

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  document.getElementById("bg-scene").appendChild(renderer.domElement)

  // Create a group for all objects
  const group = new THREE.Group()
  scene.add(group)

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 3000

  const posArray = new Float32Array(particlesCount * 3)
  const colorsArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 100
    posArray[i + 1] = (Math.random() - 0.5) * 100
    posArray[i + 2] = (Math.random() - 0.5) * 100

    // Color - blue to purple gradient
    colorsArray[i] = 0.1 + Math.random() * 0.2 // R
    colorsArray[i + 1] = 0.3 + Math.random() * 0.3 // G
    colorsArray[i + 2] = 0.6 + Math.random() * 0.4 // B
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3))

  // Create material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  })

  // Create points
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  group.add(particlesMesh)

  // Create some floating houses/buildings
  const createHouse = (x, y, z, scale = 1) => {
    const house = new THREE.Group()

    // Base
    const baseGeometry = new THREE.BoxGeometry(2, 1, 2)
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    house.add(base)

    // Roof
    const roofGeometry = new THREE.ConeGeometry(1.5, 1, 4)
    const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x2563eb })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.y = 1
    roof.rotation.y = Math.PI / 4
    house.add(roof)

    house.position.set(x, y, z)
    house.scale.set(scale, scale, scale)

    return house
  }

  // Add some houses
  for (let i = 0; i < 20; i++) {
    const x = (Math.random() - 0.5) * 80
    const y = (Math.random() - 0.5) * 80
    const z = (Math.random() - 0.5) * 80
    const scale = 0.5 + Math.random() * 1.5

    const house = createHouse(x, y, z, scale)
    group.add(house)

    // Add animation data
    house.userData = {
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      floatSpeed: 0.005 + Math.random() * 0.01,
      floatHeight: 0.2 + Math.random() * 0.5,
      initialY: y,
      floatOffset: Math.random() * Math.PI * 2,
    }
  }

  // Mouse movement effect
  let mouseX = 0
  let mouseY = 0
  let targetX = 0
  let targetY = 0

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1
  })

  // Animation loop
  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)

    const elapsedTime = clock.getElapsedTime()

    // Smooth camera movement following mouse
    targetX = mouseX * 0.2
    targetY = mouseY * 0.2
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    // Rotate the entire group slowly
    group.rotation.y += 0.001

    // Animate houses
    group.children.forEach((child) => {
      if (child.userData && child.userData.floatSpeed) {
        // Floating animation
        child.position.y =
          child.userData.initialY +
          Math.sin(elapsedTime * child.userData.floatSpeed + child.userData.floatOffset) * child.userData.floatHeight

        // Rotation animation
        child.rotation.y += child.userData.rotationSpeed
      }
    })

    // Rotate particles
    particlesMesh.rotation.x += 0.0003
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
})
