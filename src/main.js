import * as Pixi from 'pixi.js'
import calcViewport from './modules/calc-viewport'

export default selector => {
	const { width, height } = calcViewport()

	const r = new Pixi.WebGLRenderer({
		width,
		height,
		antialias: true,
		resolution: 1
	})

	// Adjust viewport size on window resize
	window.addEventListener('resize', () => {
		const { width, height } = calcViewport()

		r.resize(width, height)
	})

	selector.appendChild(r.view)

	const stage = new Pixi.Container()

	r.render(stage)
}
