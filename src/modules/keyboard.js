// Arrow keys & WASD
const defaultKeys = {
	up: [38, 87],
	down: [40, 83],
	left: [37, 65],
	right: [39, 68]
}

class Keyboard {
	constructor (customKeys) {
		const keybinds = { ...defaultKeys, ...customKeys }

		Object.keys(keybinds).forEach(key => {
			this[key] = false
		})

		window.addEventListener('keydown', evt => {
			Object.keys(keybinds).forEach(key => {
				if (keybinds[key].includes(evt.keyCode)) this[key] = true
			})
		})

		window.addEventListener('keyup', evt => {
			Object.keys(keybinds).forEach(key => {
				if (keybinds[key].includes(evt.keyCode)) this[key] = false
			})
		})
	}
}

export default Keyboard
