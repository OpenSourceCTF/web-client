const aspectRatio = 3 / 2
const maxWidth = 1280

function fullscreenWidth () {
	const screenRatio = window.screen.width / window.screen.height
	return screenRatio > aspectRatio ? window.screen.height * aspectRatio : window.screen.width
}

const calcViewport = (fullScreenEnabled) => {
	const width = Math.floor(fullScreenEnabled ? fullscreenWidth() : Math.min(window.innerWidth, maxWidth))
	const height = Math.round(width / aspectRatio)

	return { width, height }
}

export {
	calcViewport,
	maxWidth
}
