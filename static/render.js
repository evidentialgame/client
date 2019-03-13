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
		'x': renderer.element.width / 3,
		'y': renderer.element.height - 100
	},
	{
		'x': renderer.element.width - renderer.element.width / 3,
		'y': renderer.element.height - 100
	},
	{
		'x': renderer.element.width / 2,
		'y': renderer.element.height - 300
	}
]

const selectRegions = []

for (let i = 0; i < playerLocations.length; i++) {
	const genRect = new canvax.Rectangle({
		'x': playerLocations[i].x - 100,
		'y': playerLocations[i].y - 100,
		'width': 130,
		'height': 240
	})

	genRect.on('click', () => {
		document.querySelector('#messageBox').value = '/w ' + gameState.players[i].name + ' '
		document.querySelector('#messageBox').focus()
	})

	genRect.on('mousein', () => {
		renderer.element.style.cursor = 'pointer'
	})

	genRect.on('mouseout', () => {
		renderer.element.style.cursor = 'default'
	})

	selectRegions.push(genRect)
}

const rainParticles = []

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

// Process rain particles

setInterval(() => {
	for (let i = 0; i < rainParticles.length; i++) {
		if (rainParticles[i].y > rainParticles[i].endsAt) {
			rainParticles[i].dying = true

			rainParticles[i].dyingFor++

			if (rainParticles[i].dyingFor % 10 === 0) {
				rainParticles[i].currentSprite++
			}

			if (rainParticles[i].currentSprite > 5) {
				rainParticles.splice(i, 1)

				i--
			}
		}
		else {
			rainParticles[i].y += rainParticles[i].fallRate
		}
	}
}, 10)

setInterval(() => {
	if (gameState.raining) {
		rainParticles.push({
			'x': Math.floor(Math.random() * renderer.element.width),
			'y': -10,
			'endsAt': Math.floor(Math.random() * (renderer.element.height - 400)) + 400,
			'dying': false,
			'currentSprite': 0,
			'dyingFor': 0,
			'fallRate': Math.floor(Math.random() * 3) + 2
		})
	}
}, 100)

// Main rendering

const renderFrame = () => {
	renderer.clear()
	
	// Background image
	
	renderer.element.style.backgroundImage = 'url(\'images/backgrounds/station.png\')'
	
	renderer.add(new Image({
		'width': 50,
		'height': 50,
		'x': renderer.element.width / 2 - 25,
		'y': renderer.element.height / 2 - 80,
		'source': 'images/sprites/objects/rose.png'
	}))
	
	renderer.add(new Text({
		'text': 'dis a rose',
		'font': '20px Pixelated',
		'color': '#010101',
		'alignment': 'center',
		'x': renderer.element.width / 2,
		'y': renderer.element.height / 2
	}))

	// Render players
	
	for (let i = 0; i < gameState.players.length; i++) {
		renderer.add(selectRegions[i])
		
		const playerImage = gameState.players[i].name.toLowerCase() === 'borilla' ? 'images/borilla.png' : 'images/sprites/officer/sprite_' + sprites.officer[0] + '.png'
		
		renderer.add(new Image({
			'width': 240,
			'height': 240,
			'x': playerLocations[i].x - 120,
			'y': playerLocations[i].y - 120,
			'source': playerImage
		}))
		
		renderer.add(new Text({
			'text': gameState.players[i].name,
			'x': playerLocations[i].x,
			'y': playerLocations[i].y - 105,
			'alignment': 'center',
			'color': '#EFEFE7',
			'font': '25px Pixelated'
		}))
		
		if (gameState.players[i].typing) {
			renderer.add(new Rectangle({
				'x': playerLocations[i].x - 40,
				'y': playerLocations[i].y + 115,
				'backgroundColor': '#EFEFE7',
				'width': 80,
				'height': 25
			}))
			
			renderer.add(new Text({
				'text': '...',
				'x': playerLocations[i].x,
				'y': playerLocations[i].y + 140,
				'alignment': 'center',
				'color': '#000000',
				'font': '20px Pixelated'
			}))
		}
	}

	// Render rain particles

	for (let i = 0; i < rainParticles.length; i++) {
		renderer.add(new Image({
			'width': 32,
			'height': 32,
			'source': 'images/sprites/rain/sprite_' + rainParticles[i].currentSprite + '.png',
			'x': rainParticles[i].x - 16,
			'y': rainParticles[i].y - 16,
			'lands': rainParticles[i].endsAt
		}))
	}

	// Render title

	renderer.add(new Text({
		'text': gameState.title.title,
		'x': renderer.element.width / 2,
		'y': renderer.element.height - 100,
		'alignment': 'center',
		'color': '#EFEFE7',
		'font': '30px Pixelated'
	}))

	renderer.add(new Text({
		'text': gameState.title.subtitle,
		'x': renderer.element.width / 2,
		'y': renderer.element.height - 80,
		'alignment': 'center',
		'color': '#EFEFE7',
		'font': '20px Pixelated'
	}))
	
	renderer.elements = renderer.entities.sort((a, b) => {
		const ah = (typeof a.height === 'number' ? a.height : a.radius)
		const bh = (typeof b.height === 'number' ? b.height : b.radius)
		
		const ay = typeof a.lands === 'number' ? a.lands/* + ah*/ : (a.y + ah)
		const by = typeof b.lands === 'number' ? b.lands/* + bh*/ : (b.y + bh)
		
		if (ay >= by || ay.type === 'text') {
			return 1
		}
		else return -1
	})

	renderer.render()
	
	window.requestAnimationFrame(renderFrame)
}

renderFrame()