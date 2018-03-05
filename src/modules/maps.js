import * as PIXI from 'pixi.js'
import { match, when } from 'match-when'
import colorConvert from 'color-convert'
import cfg from '../config'

const { Graphics, Polygon } = PIXI

const hexStringToNumber = hex => parseInt(hex, 16)

const scale = cfg.get('GFX_SCALE')
const s = (...nums) => nums.map(num => num * scale)

// Instantiate this here to avoid having to pass it as an argument to each
// function
export const gfx = new Graphics()

export const renderBomb = ({ x, y }) => {
	gfx
		.beginFill(0x000000, 1)
		.drawCircle(...s(x, y, 0.45))
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
		.drawCircle(...s(x, y, 0.5))
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
		.drawPolygon(genFlag(...s(x, y)))
}

export const renderGate = ({ poly, type }) => {
	// TODO: Render correct colors for team
	const color = match(type, {
		[when('on')]: 0xFFA500,
		[when('off')]: 0x9800FF,
		[when()]: 0x00FF00
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

// no gravity well rendering yet (do we even need it?)

export const renderPortal = ({ x, y }) => {
	// TODO: Different color for each set of linked portals to eliminate confusion?
	gfx
		.beginFill(0xFFFFFF, 1)
		.drawCircle(...s(x, y, 0.5))
}

export const renderPowerup = ({ type, x, y }) => {
	gfx
		.beginFill(0x00FF00, 1)
		.drawCircle(...s(x, y, 0.5))
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
		.drawPolygon(genSpike(...s(x, y)))
}

export const renderTile = ({ poly, type }) => {
	// TODO: Find out purpose of c1, c2, c3 from Mr. G (whackashoe)
	const color = hexStringToNumber(colorConvert.rgb.hex([poly.c1r, poly.c1g, poly.c1b]))
	const alpha = poly.c1a / 255

	const tile = new Polygon(...s(
		poly.x1, poly.y1,
		poly.x2, poly.y2,
		poly.x3, poly.y3
	))

	gfx
		.beginFill(color, alpha)
		.drawPolygon(tile)
}

export const renderToggle = ({ tags, timer, x, y }) => {
	gfx
		.beginFill(0xE8BC7A, 1)
		.drawCircle(...s(x, y, 0.25))
}

export const renderWall = ({ poly }) => {
	// TODO: Find out purpose of c1, c2, c3 from Mr. G (whackashoe)
	const color = hexStringToNumber(colorConvert.rgb.hex([poly.c1r, poly.c1g, poly.c1b]))
	const alpha = poly.c1a / 255

	const wall = new Polygon(...s(
		poly.x1, poly.y1,
		poly.x2, poly.y2,
		poly.x3, poly.y3
	))

	gfx
		.beginFill(color, alpha)
		.drawPolygon(wall)
}
