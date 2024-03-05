/* globals WebVTTParser VologramPlayer ThreeJsPlayerExtension */
// Copyright (c) 2023 Volograms.

// This component waits for a tap to place a hologram.
const vologramPlayerComponent = () => ({
    schema: {
      'src': {type: 'string', default: ''},  // hologram asset path
      'size': {default: 1},  // hologram starting size
      'loop': {type: 'boolean', default: false},
      'muted': {type: 'boolean', default: false},
      'state': {type: 'string', default: 'init'},
      'lastUpdateTime': {type: 'number', default: 0},
      'meshPosition': {type: 'vec3'},
      'play': {type: 'boolean', default: true},
    },
    events: {
      playStream(event) {
        const {state} = event.detail
        this.settingPlayFromEvent = true
        if (state) {
          if (this.el.getAttribute('state') === 'ready') {
            this.vologramPlayer.start()
          } else {
            this.vologramPlayer.play()
          }
          this.el.setAttribute('state', 'playing')
          this.el.setAttribute('play', true)
        } else {
          this.el.setAttribute('state', 'paused')
          this.el.setAttribute('play', false)
          this.vologramPlayer.pause()
        }
      },
      muteStream(event) {
        this.el.setAttribute('muted', event.detail.state)
      },
      replayStream(event) {
        this.el.setAttribute('state', 'playing')
        this.vologramPlayer.start()
      },
      stopStream(event) {
        this.el.setAttribute('state', 'closed')
        this.vologramPlayer.close()
      },
    },
    loadVologram() {
      this.el.setAttribute('state', 'loading')
      const sequenceUrl = this.data.src
      const gl = this.el.sceneEl.renderer.getContext()
      const vologramExts = [ThreeJsPlayerExtension(gl)]
      this.vologramPlayer = VologramPlayer(vologramExts)
  
      this.vologramPlayer.registerCallback('onended', () => {
        if (!this.vologramPlayer.loop) {
          this.el.emit('endStreamReached', {}, true)
          this.el.setAttribute('state', 'ended')
        }
      })
  
      window.addEventListener('unload', (event) => {
        this.el.emit('stopStream', {}, true)
      })
  
      const downloadProgress = (p) => {
        this.el.emit('downloadProgress', {progress: p}, true)
      }
  
      this.vologramPlayer.open({sequenceUrl}, downloadProgress)
        .then((result) => {
          if (!result || this.vologramPlayer.vologram.sequenceUrl === '') {
            this.el.setAttribute('state', 'failed')
            this.el.emit('loadFailed', {
              error: new Error(
                'Failed to open vologram'
              ),
            }, true)
            return
          }
          this.vologram = this.vologramPlayer.vologram
          this.vologramPlayer.extensions.threejs.objects.mesh.castShadow = true
          this.el.setObject3D('mesh', this.vologramPlayer.extensions.threejs.objects.mesh)
          this.el.getObject3D('mesh').position.set(
            this.data.meshPosition.x,
            this.data.meshPosition.y,
            this.data.meshPosition.z
          )
          this.el.getObject3D('mesh').scale.set(-this.data.size, this.data.size, this.data.size)
          this.el.setAttribute('state', 'ready')
          this.el.emit('streamReady', {player: this.vologramPlayer}, true)
          if (this.data.play) {
            this.el.emit('playStream', {state: true}, true)
          }
          this.renderMesh = true
        })
        .catch((error) => {
          this.el.setAttribute('state', 'failed')
          this.el.emit('loadFailed', {error}, true)
        })
    },
    async init() {
      this.el.setAttribute('state', 'init')
  
      this.vologram = {}
      this.vologramInterface = undefined
      this.meshInitialized = false
      this.playbackEnabled = false
      this.renderMesh = false
  
      // we need this to wait until all the scripts are loaded otherwise it can crash
      if (document.readyState === 'complete') {
        // console.log('Document already loaded') // eslint-disable-line
        this.loadVologram()
      } else {
        window.addEventListener('load', (event) => {
          // console.log('Wait for load event') // eslint-disable-line
          this.loadVologram()
        })
      }
    },
    tick() {
      if (this.vologramPlayer &&
          // (this.el.getAttribute('state') === 'playing' || this.renderMesh) &&
          this.vologramPlayer.extensions.threejs) {
        this.vologramPlayer.extensions.threejs.renderUpdate()
        this.renderMesh = false
        this.el.setAttribute('lastUpdateTime', this.vologram.lastUpdateTime)
      }
    },
    update(oldData) {
      if (this.el.getAttribute('state') === 'init') return
      if (!this.vologramPlayer) return
  
      if (this.vologramPlayer.loop !== this.data.loop) {
        this.vologramPlayer.loop = this.data.loop
      }
      if (this.vologramPlayer.mute !== this.data.muted) {
        this.vologramPlayer.mute = this.data.muted
      }
      if (oldData.meshPosition !== this.data.meshPosition) {
        this.el.getObject3D('mesh').position.set(
          this.data.meshPosition.x,
          this.data.meshPosition.y,
          this.data.meshPosition.z
        )
      }
      if (oldData.size !== this.data.size) {
        this.el.getObject3D('mesh').scale.set(
          -this.data.size,
          this.data.size,
          this.data.size
        )
      }
  
      if (oldData.play !== this.data.play) {
        this.el.emit('playStream', {state: this.data.play}, true)
      }
    },
    remove() {
      // removing player and cleaning up video/audio elements if they still exist
      // console.log('removing player and cleaning up video/audio elements')
      this.vologramPlayer?.close()
      const videoEls = document.body.getElementsByTagName('video')
      const audioEls = document.body.getElementsByTagName('audio')
      for (const el of videoEls) {
        el.remove()
        //  console.log("removing video element")
      }
      for (const el of audioEls) {
        el.remove()
        // console.log("removing audio element")
      }
    },
  })
  
  const vologramPlayerPrimitive = () => ({
    defaultComponents: {
      'geometry': {
        primitive: 'box',
        width: 0,
        height: 0,
        depth: 0,
      },
      'vologram-player-component': {},
    },
    mappings: {
      'src': 'vologram-player-component.src',
      'size': 'vologram-player-component.size',
      'loop': 'vologram-player-component.loop',
      'muted': 'vologram-player-component.muted',
      'mesh-position': 'vologram-player-component.meshPosition',
      'play': 'vologram-player-component.play',
      'state': 'vologram-player-component.state',
    },
  })
  
  export {vologramPlayerComponent, vologramPlayerPrimitive}
  