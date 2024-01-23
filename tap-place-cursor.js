// Component that places trees at cursor location when screen is tapped
const tapPlaceCursorComponent = {
  init() {
    this.raycaster = new THREE.Raycaster()
    this.camera = document.getElementById('camera')
    this.threeCamera = this.camera.getObject3D('camera')
    this.ground = document.getElementById('ground')

    // 2D coordinates of the raycast origin, in normalized device coordinates (NDC)---X and Y
    // components should be between -1 and 1.  Here we want the cursor in the center of the screen.
    this.rayOrigin = new THREE.Vector2(0, 0)

    this.cursorLocation = new THREE.Vector3(0, 0, 0)

    this.progressText = document.getElementById('progress-text')

    this.vologram = document.getElementById('volo')
    // this.vologram.setAttribute('play', false)
    this.vologram.addEventListener('downloadProgress', (e) => {
      const percent = Math.floor(e.detail.progress * 100)
      this.progressText.setAttribute('value', `Downloading: ${percent}%`)
    })

    this.vologram.addEventListener('loadFailed', (e) => {
      console.error(e)
      this.progressText.setAttribute('value', 'Download Error')
    })

    this.vologram.addEventListener('streamReady', (e) => {
      this.vologramPlayer = e.detail.player
      this.vologramObject = this.vologramPlayer.vologram
      this.progressText.setAttribute('value', 'Tap to position vologram')

      this.vologram.setAttribute('position', this.el.object3D.position)
      const {x, z} = this.camera.object3D.position
      const {y} = this.vologram.object3D.position
      const lookAtTo = new THREE.Vector3(x, y, z)
      this.vologram.object3D.lookAt(lookAtTo)
    })

    this.el.sceneEl.addEventListener('click', (event) => {
      const voloState = this.vologram.getAttribute('state')
      if (voloState === 'loading') return
      // Place vologram at location of the cursor
      if (voloState === 'playing' || voloState === 'paused') {
        this.vologram.setAttribute('position', this.el.object3D.position)
        const {x, z} = this.camera.object3D.position
        const {y} = this.vologram.object3D.position
        const lookAtTo = new THREE.Vector3(x, y, z)
        this.vologram.object3D.lookAt(lookAtTo)
      }
    })
  },
  tick() {
    // Raycast from camera to 'ground'
    this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera)
    const intersects = this.raycaster.intersectObject(this.ground.object3D, true)

    if (intersects.length > 0) {
      const [intersect] = intersects
      this.cursorLocation = intersect.point
    }
    this.el.object3D.position.y = 0.1
    this.el.object3D.position.lerp(this.cursorLocation, 0.4)
    this.el.object3D.rotation.y = this.threeCamera.rotation.y

    this.progressText.object3D.position.x = this.cursorLocation.x
    this.progressText.object3D.position.y = this.cursorLocation.y + 0.50
    this.progressText.object3D.position.z = this.cursorLocation.z
    this.progressText.object3D.lookAt(this.camera.object3D.position)

    if (this.vologram) {
      const voloState = this.vologram.getAttribute('state')
      if (voloState === 'playing' || voloState === 'paused') {
        if (this.el.object3D.position.distanceTo(this.vologram.object3D.position) >= 3) {
          this.progressText.setAttribute('visible', 'true')
        } else {
          this.progressText.setAttribute('visible', 'false')
        }
      }
    }
  },
}

export {tapPlaceCursorComponent}
