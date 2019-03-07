// Load after index.js

const canvax = require('canvaxjs')
const {Rectangle, Image, Circle, Text} = canvax

const renderer = new canvax.Renderer(document.querySelector('canvas'))

renderer.element.width = window.innerWidth * .6
renderer.element.height = window.innerHeight

renderer.ctx.imageSmoothingEnabled = false

const playerLocations = [
	{
		'x': 100,
		'y': renderer.element.height / 2
	},
	{
		'x': renderer.element.width - 100,
		'y': renderer.element.height / 2
	},
	{
		'x': renderer.element.width / 2,
		'y': 100
	},
	{
		'x': renderer.element.width / 2,
		'y': renderer.element.height - 100
	}
]

const sprites = {
	'officer': [0, 2],
	'detective': [0, 2]
}

setInterval(() => {
	Object.keys(sprites).forEach((spriteName) => {
		sprites[spriteName][0]++
		
		if (sprites[spriteName][0] > sprites[spriteName][1]) {
			sprites[spriteName][0] = 0
		}
	})
}, 1000)

const renderFrame = () => {
	renderer.clear()
	
	renderer.add(new Image({
		'width': 50,
		'height': 50,
		'x': renderer.element.width / 2 - 25,
		'y': renderer.element.height / 2 - 25,
		'source': 'images/sprites/objects/rose.png'
	}))
	
	for (let i = 0; i < gameState.players.length; i++) {
		renderer.add(new Image({
			'width': 140,
			'height': 140,
			'x': playerLocations[i].x - 70,
			'y': playerLocations[i].y - 70,
			'source': 'images/sprites/officer/sprite_' + sprites.officer[0] + '.png'
		}))
		
		renderer.add(new Text({
			'text': gameState.players[i].name,
			'x': playerLocations[i].x,
			'y': playerLocations[i].y - 70,
			'alignment': 'center',
			'color': '#EFEFE7',
			'font': '20px Pixelated'
		}))
		
		if (gameState.players[i].typing) {
			renderer.add(new Rectangle({
				'x': playerLocations[i].x - 40,
				'y': playerLocations[i].y + 80,
				'backgroundColor': '#EFEFE7',
				'width': 80,
				'height': 25
			}))
			
			renderer.add(new Text({
				'text': '...',
				'x': playerLocations[i].x,
				'y': playerLocations[i].y + 105,
				'alignment': 'center',
				'color': '#000000',
				'font': '20px Pixelated'
			}))
		}
	}
	
	renderer.render()
	
	window.requestAnimationFrame(renderFrame)
}

renderFrame()