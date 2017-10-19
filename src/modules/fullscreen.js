const requestFullscreen = (element) => {
	if (element.requestFullscreen) element.requestFullscreen()
	else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()
	else if (element.mozRequestFullScreen) element.mozRequestFullScreen()
}

const exitFullscreen = () => {
	if (document.exitFullscreen) document.exitFullscreen()
	else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
	else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
}

const fullscreenElement = () =>
	document.fullscreenElement ||
	document.webkitFullscreenElement ||
	document.mozFullScreenElement

export { requestFullscreen, exitFullscreen, fullscreenElement }
