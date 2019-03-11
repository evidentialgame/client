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
		'x': playerLocations[i].x - 70,
		'y': playerLocations[i].y - 70,
		'width': 140,
		'height': 140
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
	rainParticles.push({
		'x': Math.floor(Math.random() * renderer.element.width),
		'y': -10,
		'endsAt': Math.floor(Math.random() * (renderer.element.height - 400)) + 400,
		'dying': false,
		'currentSprite': 0,
		'dyingFor': 0,
		'fallRate': Math.floor(Math.random() * 3) + 2
	})
}, 50)

// Main rendering

const renderFrame = () => {
	renderer.clear()
	
	/*renderer.add(new Image({
		'width': 50,
		'height': 50,
		'x': renderer.element.width / 2 - 25,
		'y': renderer.element.height / 2 - 25,
		'source': 'images/sprites/objects/rose.png'
	}))*/

	// Render players
	
	for (let i = 0; i < gameState.players.length; i++) {
		renderer.add(selectRegions[i])

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

	// Render rain particles

	for (let i = 0; i < rainParticles.length; i++) {
		renderer.add(new Image({
			'width': 16,
			'height': 16,
			'source': 'images/sprites/rain/sprite_' + rainParticles[i].currentSprite + '.png',
			'x': rainParticles[i].x - 4,
			'y': rainParticles[i].y - 4
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

	renderer.render()
	
	window.requestAnimationFrame(renderFrame)
}

renderFrame()