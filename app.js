// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import {tapPlaceCursorComponent} from './tap-place-cursor'

// Register custom A-Frame components in app.js before the scene in body.html has loaded.
AFRAME.registerComponent('tap-place-cursor', tapPlaceCursorComponent)
