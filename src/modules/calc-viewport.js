const aspectRatio = 16 / 10
const maxWidth = 1280

function fullscreenWidth () {
	const screenRatio = window.screen.width / window.screen.height
	return screenRatio > aspectRatio ? window.screen.height * aspectRatio : window.screen.width
}

const calcViewport = (fullScreenEnabled) => {
	const width = Math.floor(fullScreenEnabled ? fullscreenWidth() : 0.85 * Math.min(window.innerWidth, maxWidth))
	const height = Math.round(width / aspectRatio)

	return { width, height }
}

export { calcViewport, maxWidth }
