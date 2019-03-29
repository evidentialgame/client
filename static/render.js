// Load after index.js

const canvax = require('canvaxjs')
const {Rectangle, Image, Circle, Ellipse, Text} = canvax

const renderer = new canvax.Renderer(document.querySelector('canvas'))

renderer.element.width = window.innerWidth * .6
renderer.element.height = window.innerHeight

renderer.ctx.imageSmoothingEnabled = false

const allPlayerLocations = {
	'images/backgrounds/station.png': [
		{
			'x': 100,
			'y': renderer.element.height / 2,
			'spriteDirection': 'right'
		},
		{
			'x': renderer.element.width - 100,
			'y': renderer.element.height / 2,
			'spriteDirection': 'left'
		},
		{
			'x': renderer.element.width / 4,
			'y': renderer.element.height - 200,
			'spriteDirection': 'right'
		},
		{
			'x': renderer.element.width - renderer.element.width / 4,
			'y': renderer.element.height - 200,
			'spriteDirection': 'left'
		},
		{
			'x': renderer.element.width / 2,
			'y': renderer.element.height - 200,
			'spriteDirection': 'right'
		}
	],
	'images/backgrounds/crimescene1.png': [
		{
			'x': 100,
			'y': renderer.element.height - 160,
			'spriteDirection': 'right'
		},
		{
			'x': 200,
			'y': renderer.element.height - 210,
			'spriteDirection': 'right'
		},
		{
			'x': renderer.element.width / 2 + 10,
			'y': renderer.element.height - 275,
			'spriteDirection': 'left'
		}
	]
}

let playerLocations = allPlayerLocations['images/backgrounds/station.png']

const selectRegions = []

for (let i = 0; i < playerLocations.length; i++) {
	const genRect = new canvax.Rectangle({
		'x': playerLocations[i].x - (130 / 2),
		'y': playerLocations[i].y - (240 / 2),
		'width': 130,
		'height': 240
	})

	genRect.on('click', () => {
		abstractor.send('select', {
			'index': i
		})
	})

	genRect.on('mousein', () => {
		renderer.element.style.cursor = 'pointer'
	})

	genRect.on('mouseout', () => {
		renderer.element.style.cursor = 'default'
	})

	selectRegions.push(genRect)
}

const genButton = (right = true, buttonText, color = '#BFBFBF') => {
	const xpos = (right ? renderer.element.width / 3 : renderer.element.width - (renderer.element.width / 3))
	const ypos = (renderer.element.height - (renderer.element.height / 3))
	
	const genText = new canvax.Text({
		'text': buttonText,
		'alignment': 'center',
		'x': xpos,
		'y': ypos + 30,
		'font': '30px Pixelated',
		'z': 100
	})
	
	const genRect = new canvax.Rectangle({
		'x': xpos - (250 / 2),
		'y': ypos - (40 / 2),
		'width': 250,
		'height': 40,
		'backgroundColor': color,
		'z': 90
	})
	
	genRect.on('mousein', () => {
		renderer.element.style.cursor = 'pointer'
	})
	
	genRect.on('mouseout', () => {
		renderer.element.style.cursor = 'default'
	})
	
	genRect.on('click', () => {
		renderer.element.style.cursor = 'default'
	})
	
	return [genRect, genText]
}

const voteEntities = genButton(true, 'Accept', '#BFBFBF').concat(genButton(false, 'Reject', '#BFBFBF'))

for (let i = 0; i < voteEntities.length; i++) {
	if (voteEntities[i].type !== 'rectangle') continue
	
	voteEntities[i].on('click', () => {
		abstractor.send('vote', {
			'value': i === 0 ? true : false
		})
	})
}

const tamperSelectEntities = genButton(true, 'Investigate', '#47AB6C').concat(genButton(false, 'Tamper', '#ED553B'))

for (let i = 0; i < tamperSelectEntities.length; i++) {
	if (tamperSelectEntities[i].type !== 'rectangle') continue
	
	tamperSelectEntities[i].on('click', () => {
		abstractor.send('setTampering', {
			'tampering': i === 0 ? false : true
		})
	})
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
	if (gameState.weather === 1) {
		rainParticles.push({
			'x': Math.floor(Math.random() * renderer.element.width),
			'y': -10,
			'endsAt': renderer.element.height - Math.floor(Math.random() * 200),
			'dying': false,
			'currentSprite': 0,
			'dyingFor': 0,
			'fallRate': Math.floor(Math.random() * 3) + 3
		})
	}
}, 100)

// Main rendering

const renderFrame = () => {
	renderer.clear()
	
	// Background image
	
	if (typeof gameState.background === 'string') {
		renderer.element.style.backgroundImage = 'url(\'' + gameState.background + '\')'
		
		playerLocations = allPlayerLocations[gameState.background]
	}
	
	/*renderer.add(new Image({
		'width': 50,
		'height': 50,
		'x': renderer.element.width / 2 - 25,
		'y': renderer.element.height / 2 - 80,
		'source': 'images/sprites/objects/rose.png'
	}))*/
	
	renderer.add(new Text({
		'text': gameState.title.boardText,
		'font': '20px Pixelated',
		'color': '#010101',
		'alignment': 'center',
		'x': renderer.element.width / 2,
		'y': renderer.element.height / 2 - 100,
		'maxWidth': 200,
		'z': -1
	}))

	// Render players
	
	for (let i = 0; i < gameState.players.length; i++) {
		if (gameState.background === 'images/backgrounds/station.png') {
			renderer.add(selectRegions[i])
		}
		
		const playerImage = 'images/sprites/' + gameState.players[i].skin + '/' + playerLocations[i].spriteDirection + '_' + sprites.officer[0] + '.png'
		
		if (gameState.players[i].selected && gameState.background === 'images/backgrounds/station.png') {
			renderer.add(new Ellipse({
				'width': 150,
				'height': 50,
				'x': playerLocations[i].x - (150 / 2),
				'y': playerLocations[i].y + 105,
				'borderColor': '#FFDC00',
				'borderWeight': 5,
				'z': -10
			}))
		}
		
		renderer.add(new Image({
			'width': 240,
			'height': 240,
			'x': playerLocations[i].x - 120,
			'y': playerLocations[i].y - 120,
			'source': playerImage,
			'z': 70
		}))
		
		renderer.add(new Text({
			'text': gameState.players[i].name,
			'x': playerLocations[i].x,
			'y': playerLocations[i].y - 105,
			'alignment': 'center',
			'color': '#EFEFE7',
			'font': '25px Pixelated',
			'z': 70
		}))
		
		if (gameState.players[i].typing) {
			renderer.add(new Rectangle({
				'x': playerLocations[i].x - 40,
				'y': playerLocations[i].y + 135,
				'backgroundColor': '#EFEFE7',
				'width': 80,
				'height': 25,
				'z': 70
			}))
			
			renderer.add(new Text({
				'text': '...',
				'x': playerLocations[i].x,
				'y': playerLocations[i].y + 160,
				'alignment': 'center',
				'color': '#000000',
				'font': '20px Pixelated',
				'z': 80
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
			'z': rainParticles[i].endsAt > renderer.element.height - 100 ? 90 : 10
		}))
	}

	// Render title

	if (gameState.title.displayMode === 0) {
		renderer.add(new Text({
			'text': gameState.title.title,
			'x': renderer.element.width / 2,
			'y': renderer.element.height - 100,
			'alignment': 'center',
			'color': gameState.title.titleColor,
			'font': '30px Pixelated',
			'z': 100
		}))

		renderer.add(new Text({
			'text': gameState.title.subtitle,
			'x': renderer.element.width / 2,
			'y': renderer.element.height - 80,
			'alignment': 'center',
			'color': gameState.title.subtitleColor,
			'font': '20px Pixelated',
			'z': 100
		}))
	}
	else if (gameState.title.displayMode === 1) {
		renderer.add(new Rectangle({
			'x': 0,
			'y': renderer.element.height / 2 - 80,
			'width': renderer.element.width,
			'height': 80 * 2,
			'backgroundColor': '#05090C',
			'z': 90
		}))

		renderer.add(new Text({
			'text': gameState.title.title,
			'x': renderer.element.width / 2,
			'y': renderer.element.height / 2,
			'alignment': 'center',
			'color': gameState.title.titleColor,
			'font': '30px Pixelated',
			'z': 100
		}))

		renderer.add(new Text({
			'text': gameState.title.subtitle,
			'x': renderer.element.width / 2,
			'y': renderer.element.height / 2 + 40,
			'alignment': 'center',
			'color': gameState.title.subtitleColor,
			'font': '20px Pixelated',
			'z': 100
		}))
	}
	
	renderer.entities = renderer.entities.sort((a, b) => {
		const ah = (typeof a.height === 'number' ? a.height : a.radius)
		const bh = (typeof b.height === 'number' ? b.height : b.radius)
		
		const ay = a.y + ah
		const by = b.y + bh
		
		if (!a.hasOwnProperty('z')) {
			if (ay >= by) {
				return 1 // render a on top
			}
			else return -1 // render b on top
		}
		else if (a.hasOwnProperty('z') && !b.hasOwnProperty('z')) {
			if (a.z > 0) {
				return 1
			}
			else return -1
		}
		else if (a.hasOwnProperty('z') && b.hasOwnProperty('z')) {
			if (a.z > b.z) {
				return 1
			}
			else return -1
		}
	})
	
	if (gameState.showVoteUI === true) {
		renderer.entities = renderer.entities.concat(voteEntities)
	}
	
	if (gameState.tamperUI.display === true) {
		tamperSelectEntities.filter((entity) => entity.type === 'rectangle')[1].backgroundColor = gameState.tamperUI.canTamper ? '#ED553B' : '#BFBFBF'
		
		renderer.entities = renderer.entities.concat(tamperSelectEntities)
	}

	renderer.render()
	
	const gradient = renderer.ctx.createRadialGradient(renderer.element.width / 2, renderer.element.height / 2, 20, renderer.element.width / 2, renderer.element.height / 2, 400)
	
	gradient.addColorStop(0, '#000000' + Buffer.from([Math.min(gameState.vignette - 10, 255)]).toString('hex'))
	
	gradient.addColorStop(1, '#000000' + Buffer.from([Math.min(gameState.vignette + 30, 255)]).toString('hex'))
	
	renderer.ctx.fillStyle = gradient
	
	renderer.ctx.fillRect(0, 0, renderer.element.width, renderer.element.height)
	
	window.requestAnimationFrame(renderFrame)
}

renderFrame()