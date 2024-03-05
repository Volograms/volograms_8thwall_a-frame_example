// Copyright (c) 2023 Volograms.
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {tapPlaceCursorComponent} from './tap-place-cursor'

import {vologramPlayerComponent, vologramPlayerPrimitive} from './vologram-player'

// Register custom A-Frame components in app.js before the scene in body.html has loaded.
AFRAME.registerComponent('vologram-player-component', vologramPlayerComponent())
AFRAME.registerPrimitive('vologram-player', vologramPlayerPrimitive())

AFRAME.registerComponent('tap-place-cursor', tapPlaceCursorComponent)
