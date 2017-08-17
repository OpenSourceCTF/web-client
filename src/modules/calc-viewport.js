const aspectRatio = 16 / 9
const maxWidth = 1280
const maxHeight = Math.round(maxWidth / aspectRatio)

const calcViewport = () => {
	const width = Math.min(window.innerWidth, maxWidth)
	const height = Math.min(window.innerHeight, maxHeight)

	return width >= height * aspectRatio ? {
		width: Math.round(height * aspectRatio),
		height
	} : {
		width,
		height: Math.round(width / aspectRatio)
	}
}

export default calcViewport
