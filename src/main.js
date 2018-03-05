import * as PIXI from 'pixi.js'
import {
	calcViewport,
	maxWidth as
	maxViewWidth
} from './modules/calc-viewport'
import {
	requestFullscreen,
	exitFullscreen,
	fullscreenElement
} from './modules/fullscreen'
import {
	gfx as mapGfx,
	renderBomb,
	renderBoost,
	renderFlag,
	renderGate,
	renderPortal,
	renderPowerup,
	renderSpike,
	renderTile,
	renderToggle,
	renderWall
} from './modules/maps'
import logLoadProgress from './modules/log-load-progress'
import sleep from './modules/sleep'
import cfg from './config'

// *** Renderer setup
const {
	Container,
	Graphics,
	WebGLRenderer: Renderer,
	Text,
	ticker: { Ticker }
} = PIXI

const scale = cfg.get('GFX_SCALE')

const loader = new PIXI.loaders.Loader('/static/img/client/')

const assets = [{
	name: 'ball-red',
	url: 'ball-red.png'
}]

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

// *** Key listener setup
let keys = new Array(256).fill(false)

window.onkeyup = function (e) {
	keys[e.key] = false
}
window.onkeydown = function (e) {
	keys[e.key] = true
}

const setDirFromKeyboard = () => {
	const wsdata = {
		'request': 'movement',
		'xdir': (keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0),
		'ydir': (keys['w'] ? -1 : 0) + (keys['s'] ? 1 : 0)
	}
	ws.send(JSON.stringify(wsdata))
}

// *** Websocket setup
let balls = []
let map, gamestate

const ip = cfg.get('IP_ADDRESS')
const port = cfg.get('PORT')
var ws = new WebSocket('ws://' + ip + ':' + port)

ws.onopen = e => {
	console.log('[CLIENT] Opening communications with ' + ip + ':' + port)
	ws.send(JSON.stringify({
		'request': 'gamesync',
		'login_token': 'nothing'
	}))
}

ws.onmessage = e => {
	const data = JSON.parse(e.data)
	switch (data.event) {
	case 'gamesync':
		console.log('[CLIENT] Gamesync received from server')
		console.log(data)
		map = data.data.map
		gamestate = data.data.state
		setInterval(setDirFromKeyboard, 16)
		loader.load(setup)
		break
	case 'player_added':
		setInterval(setDirFromKeyboard, 16)
		break
	case 'ballsync':
		data.data.balls.forEach(updateBall)
		break
	}
}

ws.onerror = e => {
	console.error(e.data)
}

const updateBall = (data) => {
	// TODO: filter in this way is inefficient, although with maximum 8 players...
	// also, filter returns an array
	let ball = balls.filter(function (b) {
		return (b.gameID === data.id)
	})
	if (ball.length) {
		ball[0].position.set(data.px * scale, data.py * scale)
	}
}

const populateBall = (data) => {
	let ball = new PIXI.Graphics()
	ball.beginFill(0xFF00FF)
	ball.drawCircle(0, 0, scale / 2)
	ball.endFill()
	ball.flags = data.flags
	ball.alive = data.is_alive
	ball.gameID = data.id
	ball.playerID = data.player_id
	ball.powerups = data.powerups
	balls.push(ball)
}

const renderMap = (scene) => {
	console.log('[CLIENT] Rendering map...')
	// Render the map
	map.tiles.forEach(renderTile)
	console.log(' Tiles ✔')
	map.gates.forEach(renderGate)
	console.log(' Gates ✔')
	map.walls.forEach(renderWall)
	console.log(' Walls ✔')
	map.spikes.forEach(renderSpike)
	console.log(' Spikes ✔')
	map.portals.forEach(renderPortal)
	console.log(' Portals ✔')
	map.boosters.forEach(renderBoost)
	console.log(' Boosts ✔')
	map.bombs.forEach(renderBomb)
	console.log(' Bombs ✔')
	map.powerups.forEach(renderPowerup)
	console.log(' Powerups ✔')
	map.toggles.forEach(renderToggle)
	console.log(' Toggles ✔')
	map.flags.forEach(renderFlag)
	console.log(' Flags ✔')
	scene.addChild(mapGfx)
	console.log('[CLIENT] Map successfully rendered!')
}

loader
	.add(assets)
	.on('progress', logLoadProgress)

// *** Main setup
let state
let ticker

let pregameScene
let pregameText

let playScene
let fpsCounter

function setup () {
	const { width: viewWidth, height: viewHeight } = renderer

	// Play scene
	playScene = new Container()
	playScene.visible = false

	renderMap(playScene)

	// TODO: Balls don't display in their correct position on the map
	gamestate.balls.forEach(populateBall)
	balls.forEach(function (ball) {
		playScene.addChild(ball)
	})

	stage.addChild(playScene)

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

	// FPS counter
	fpsCounter = new Text('', {
		fontFamily: 'Courier',
		fontSize: 12,
		fill: 'white'
	})
	fpsCounter.position.set(10, 10)
	stage.addChild(fpsCounter)

	// Begin the game in pregame state, and after 2 seconds enter play state
	state = pregame
	sleep(2000).then(() => {
		state = play
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
}

function play () {
	pregameScene.visible = false
	playScene.visible = true
	fpsCounter.text = `FPS: ${Math.round(ticker.FPS)}`

	// Align viewport with ball position
	// TODO: Get our own ball, not just the first indexed one
	playScene.x = (balls[0].position.x - (renderer.width / 2)) * -1
	playScene.y = (balls[0].position.y - (renderer.height / 2)) * -1
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
