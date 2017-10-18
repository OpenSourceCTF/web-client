import * as Pixi from 'pixi.js'
import { match, when } from 'match-when'
import colorConvert from 'color-convert'
import cfg from '../config'

const { Graphics, Polygon } = Pixi

const hexStringToNumber = hex => parseInt(hex, 16)

const scale = cfg.get('GFX_SCALE')
const s = (...nums) => nums.map(num => num * scale)

// Instantiate this here to avoid having to pass it as an argument to each
// function
export const gfx = new Graphics()

export const renderBomb = ({ x, y }) => {
	gfx
		.beginFill(0x000000, 1)
		.drawCircle(...s(x + 0.5, y + 0.5, 0.45))
}

export const renderBoost = ({ type, x, y }) => {
	const color = match(type, {
		[when('all')]: 0xFFFF00,
		[when('red')]: 0xFF0000,
		[when('blue')]: 0x0000FF,
		[when()]: 0x00FF00
	})

	gfx
		.beginFill(color, 1)
		.drawCircle(...s(x + 0.5, y + 0.5, 0.5))
}

const genFlag = (x, y) => new Polygon(
	x - (scale / 10), y - (scale / 2),
	x + (scale / 10), y - (scale / 2),
	x + (scale / 2), y - (scale / 2) + (scale / 5),
	x + (scale / 10), y - (scale / 2) + (scale / (5 / 2)),
	x + (scale / 10), y + (scale / 2) - (scale / 6),
	x + (scale / 2), y + (scale / 2) - (scale / 6),
	x + (scale / 2), y + (scale / 2),
	x - (scale / 2), y + (scale / 2),
	x - (scale / 2), y + (scale / 2) - (scale / 6),
	x - (scale / 10), y + (scale / 2) - (scale / 6),
	x - (scale / 10), y - (scale / 2)
)

export const renderFlag = ({ type, x, y }) => {
	const color = match(type, {
		[when('red')]: 0xFF0000,
		[when('blue')]: 0x0000FF,
		[when()]: 0x00FF00
	})

	gfx
		.beginFill(color, 1)
		.drawPolygon(genFlag(...s(x + 0.5, y + 0.5)))
}

export const renderGate = ({ poly, type }) => {
	const color = match(type, {
		[when('on')]: 0xFFA500,
		[when('off')]: 0x9800FF
	})

	const gate = new Polygon(...s(
		poly.x1, poly.y1,
		poly.x2, poly.y2,
		poly.x3, poly.y3
	))

	gfx
		.beginFill(color, 1)
		.drawPolygon(gate)
}

export const renderPortal = ({ x, y }) => {
	gfx
		.beginFill(0xFFFFFF, 1)
		.drawCircle(...s(x + 0.5, y + 0.5, 0.5))
}

export const renderPowerup = ({ x, y }) => {
	gfx
		.beginFill(0x00FF00, 1)
		.drawCircle(...s(x + 0.5, y + 0.5, 0.5))
}

const genSpike = (x, y) => new Polygon(
	x, y - (scale / 10),
	x + (scale / 2), y - (scale / 2),
	x + (scale / 10), y,
	x + (scale / 2), y + (scale / 2),
	x, y + (scale / 10),
	x - (scale / 2), y + (scale / 2),
	x - (scale / 10), y,
	x - (scale / 2), y - (scale / 2)
)

export const renderSpike = ({ x, y }) => {
	gfx
		.beginFill(0x666666, 1)
		.drawPolygon(genSpike(...s(x + 0.5, y + 0.5)))
}

export const renderTile = ({ poly, col }) => {
	const color = hexStringToNumber(colorConvert.rgb.hex([col.r, col.g, col.b]))
	const alpha = col.a / 255

	const tile = new Polygon(...s(
		poly.x1, poly.y1,
		poly.x2, poly.y2,
		poly.x3, poly.y3
	))

	gfx
		.beginFill(color, alpha)
		.drawPolygon(tile)
}

export const renderToggle = ({ x, y }) => {
	gfx
		.beginFill(0xE8BC7A, 1)
		.drawCircle(...s(x + 0.5, y + 0.5, 0.4))
}

export const renderWall = ({ poly, col }) => {
	const color = hexStringToNumber(colorConvert.rgb.hex([col.r, col.g, col.b]))
	const alpha = col.a / 255

	const wall = new Polygon(...s(
		poly.x1, poly.y1,
		poly.x2, poly.y2,
		poly.x3, poly.y3
	))

	gfx
		.beginFill(color, alpha)
		.drawPolygon(wall)
}
