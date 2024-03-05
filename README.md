# A-Frame: Vologram

This example allows users to play a vologram in AR. The code shows a basic example of how to open a vologram file, as well as change the position and rotation. Built on top of [8th Wall’s A-Frame Cursor Place Ground example](https://www.8thwall.com/8thwall/placeground-cursor-aframe).


# Description
**Vologram player** provides an easy way to play volumetric video from volograms.

*Currently Available for AFRAME projects. 
*

# How to Use

1. Include vologram-player.js file in your project
2. Include Volograms player CDN scripts in header.html
3. Create an A-Frame element: `<vologram-player></vologram-player>`
4. Control it using events: playStream(true | false), muteStream(true | false), replayStream
5. Listen to events: streamReady, endStreamReached

## vologram-player Element

### Element Attributes

`src` (string): path or url to the vologram file (setting after load currently does not change the vologram)  
`size` (number): scale of the vologram (can `get` and `set`)  
`loop` (boolean): does the vologram playback automatically loop (can `get` and `set`)  
`muted` (boolean): is the vologram audio muted (can `get` and `set`)  
`position` (vec3): the position of the vologram **object** (can `get` and `set`)  
`mesh-position` (vec3): the position of the vologram **mesh** relative to the **object** (can `get` and `set`)  
`play` (boolean): is the vologram currently playing (can `get` and `set`)  
`state` (string): the current state of the vologram player (can `get`, but DO NOT set)

### Events

#### These events are emitted by the vologram player but you should avoid emitted them from the vologram object yourself

`streamReady` ({player: VologramPlayer}): emitted when the vologram has finished downloading  
`downloadProgress`: ({progress: number}): emitted during vologram download  
`loadFailed`: ({error: Error}): emitted if the vologram fails to download  
`endStreamReached`: (): emitted when the vologram finishes playback

#### These events can be emitted from the vologram object

`playStream`: ({state: boolean}): can emit to play or pause the vologram  
`stopStream`: (): can emit to stop the vologram playback and close vologram  
`replayStream`: (): can emit to restart vologram playback  
`muteStream`: ({state: boolean}): can emit to mute or unmute vologram audio