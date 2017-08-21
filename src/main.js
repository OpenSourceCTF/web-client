import * as Pixi from 'pixi.js'
import Keyboard from './modules/keyboard'
import calcViewport from './modules/calc-viewport'
import logLoadProgress from './modules/log-load-progress'

const {
	Container,
	WebGLRenderer: Renderer,
	Sprite
} = Pixi

const loader = new Pixi.loaders.Loader('/static/img/client/')

const assets = [{
	name: 'ball-red',
	url: 'ball-red.png'
}]

export default selector => {
	// Create renderer
	const { width, height } = calcViewport()

	const renderer = new Renderer({
		width,
		height,
		antialias: true,
		resolution: 1
	})

	// Adjust viewport size on window resize
	window.addEventListener('resize', () => {
		const { width, height } = calcViewport()

		renderer.resize(width, height)
	})

	// Add view to DOM
	selector.appendChild(renderer.view)

	// Create stage
	const stage = new Container()

	loader
		.add(assets)
		.on('progress', logLoadProgress)
		.load(setup)

	// Models
	let redBall1

	// Setup
	const kb = new Keyboard()
	let state

	function setup () {
		const { width: viewWidth, height: viewHeight } = renderer

		redBall1 = new Sprite(
			loader.resources['ball-red'].texture
		)
		redBall1.width = 50
		redBall1.height = 50
		redBall1.anchor.set(0.5, 0.5)
		redBall1.rotation = 5
		redBall1.position.set(viewWidth / 2, viewHeight / 2)

		stage.addChild(redBall1)

		state = play

		main()
	}

	// Main game loop
	function main () {
		// Loop (no delta time at the moment)
		requestAnimationFrame(main)

		state()

		renderer.render(stage)
	}

	function play () {
		if (kb.up) redBall1.y -= 1
		if (kb.down) redBall1.y += 1
		if (kb.left) redBall1.x -= 1
		if (kb.right) redBall1.x += 1
	}
}
