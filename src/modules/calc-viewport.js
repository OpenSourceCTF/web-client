const aspectRatio = 16 / 9
const maxWidth = 1280
const maxHeight = maxWidth / aspectRatio

const calcViewport = () => {
	const width = Math.min(window.innerWidth, maxWidth)
	const height = Math.min(window.innerHeight, maxHeight)

	if (width >= height * aspectRatio) {
		return {
			width: Math.round(height * aspectRatio),
			height
		}
	} else {
		return {
			width,
			height: Math.round(width / aspectRatio)
		}
	}
}

export default calcViewport
