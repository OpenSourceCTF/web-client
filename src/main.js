import * as Pixi from 'pixi.js'
import Keyboard from './modules/keyboard'
import { calcViewport, maxWidth as maxViewWidth } from './modules/calc-viewport'
import { requestFullscreen, exitFullscreen, fullscreenElement } from './modules/fullscreen'
import logLoadProgress from './modules/log-load-progress'
import sleep from './modules/sleep'

const {
	Container,
	Graphics,
	WebGLRenderer: Renderer,
	Sprite,
	Text,
	ticker: { Ticker }
} = Pixi

const loader = new Pixi.loaders.Loader('/static/img/client/')

const assets = [{
	name: 'ball-red',
	url: 'ball-red.png'
}]

// Create renderer
const { width, height } = calcViewport()

const renderer = new Renderer({
	width,
	height,
	antialias: true,
	resolution: 1
})

// Create stage
const stage = new Container()

// Adjust viewport size on window resize
window.addEventListener('resize', resizeView)

loader
	.add(assets)
	.on('progress', logLoadProgress)
	.load(setup)

	// Setup
const kb = new Keyboard()
let state
let ticker

let pregameScene
let pregameText

let playScene
let fpsCounter
let redBall1

let endgameScene
let endgameText

function setup () {
	const { width: viewWidth, height: viewHeight } = renderer

	// Play scene
	playScene = new Container()
	playScene.visible = false
	stage.addChild(playScene)

	// FPS counter
	fpsCounter = new Text('', {
		fontFamily: 'Courier',
		fontSize: 12,
		fill: 'white'
	})
	fpsCounter.position.set(10, 10)
	playScene.addChild(fpsCounter)

	// Our first ball!
	redBall1 = new Sprite(
		loader.resources['ball-red'].texture
	)
	redBall1.width = 50
	redBall1.height = 50
	redBall1.anchor.set(0.5, 0.5)
	redBall1.position.set(viewWidth / 2, viewHeight / 2)
	playScene.addChild(redBall1)

	// Pregame scene
	pregameScene = new Container()
	stage.addChild(pregameScene)

	const pregameBackground = new Graphics()
	pregameBackground.beginFill(0x0000FF, 0.3)
	pregameBackground.drawRect(0, 0, viewWidth, viewHeight)
	pregameScene.addChild(pregameBackground)

	pregameText = new Text('Starting soon...', {
		fontSize: 40,
		fill: 'white'
	})
	pregameText.anchor.set(0.5, 0.5)
	pregameText.position.set(viewWidth / 2, viewHeight / 2)
	pregameScene.addChild(pregameText)

	// Endgame scene
	endgameScene = new Container()
	endgameScene.visible = false
	stage.addChild(endgameScene)

	endgameText = new Text('Game over!', {
		fontSize: 40,
		fill: 'white'
	})
	endgameText.anchor.set(0.5, 0.5)
	endgameText.position.set(viewWidth / 2, viewHeight / 2)
	endgameScene.addChild(endgameText)

	// Begin the game in pregame state, and after 2 seconds enter play state
	state = pregame
	sleep(2000).then(() => {
		state = play

		// After 10 seconds enter end state
		sleep(10000).then(() => {
			state = endgame
		})
	})

	main()
}

// Main game loop
function main () {
	ticker = new Ticker()
	ticker.stop()
	ticker.add(dt => {
		state(dt)

		renderer.render(stage)
	})
	ticker.start()
}

function pregame () {
	pregameScene.visible = true
	playScene.visible = true
	endgameScene.visible = false
}

function play () {
	pregameScene.visible = false
	playScene.visible = true
	endgameScene.visible = false

	fpsCounter.text = `FPS: ${Math.round(ticker.FPS)}`

	if (kb.up) redBall1.y -= 1
	if (kb.down) redBall1.y += 1
	if (kb.left) redBall1.x -= 1
	if (kb.right) redBall1.x += 1

	redBall1.rotation += 0.05
}

function endgame () {
	pregameScene.visible = false
	playScene.visible = false
	endgameScene.visible = true
}

function resizeView () {
	const { width, height } = calcViewport(renderer.view === fullscreenElement())
	const ratio = width / maxViewWidth

	stage.scale.x = stage.scale.y = ratio

	renderer.resize(width, height)
}

function makeFullscreen () {
	requestFullscreen(renderer.view)
}

function cancelFullscreen () {
	exitFullscreen(renderer.view)
}

export {
	renderer,
	makeFullscreen,
	cancelFullscreen
}
