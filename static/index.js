const path = require('path')
const fs = require('fs')
const net = require('net')

const {Schema, types, StreamingAbstractor, protospec} = require('protocore')

var sy=function sy(tag,attribs,children){if(!tag)throw new Error("Missing tag argument.");var gen=document.createElement(tag);if(attribs)Object.keys(attribs).forEach(function(attrib){return gen.setAttribute(attrib,attribs[attrib])});if(children)children.forEach(function(child){return child!==null?gen.appendChild(typeof child==="string"?document.createTextNode(child):child):null});return gen};

const protocolSpec = fs.readFileSync(path.join(__dirname, 'protocol.pspec'))

const abstractorFactory = () => protospec.importAbstractor(protocolSpec)

const abstractor = abstractorFactory()

const client = new net.Socket()

abstractor.bind(client)

const showBigStatus = (message) => {
	document.querySelector('#status > p').textContent = message

	document.querySelector('#status').style.display = 'block'
	document.querySelector('#login').style.display = 'none'
	document.querySelector('#game').style.display = 'none'
}

client.on('error', (err) => {
	showBigStatus('Error: Connection failed.')

	console.error(err)
})

client.on('end', () => {
	showBigStatus('Disconnected by server.')
})

client.connect(config.port, config.ip, () => {
	console.log('Connected to server.')

	document.querySelector('#status').style.display = 'none'
	document.querySelector('#login').style.display = 'block'
})

const login = () => {
	abstractor.send('login', {
		'name': document.querySelector('#login > input').value
	})
}

abstractor.on('loginStatus', (data) => {
	if (data.success) {
		document.querySelector('#login').style.display = 'none'
		document.querySelector('#game').style.display = 'flex'
	}
	else {
		document.querySelector('#loginError').textContent = data.message

		document.querySelector('#loginError').style.display = 'block'

		document.querySelector('#login > input').value = ''
	}
})

document.querySelector('#status > a').onclick = () => {
	document.querySelector('#status > a').style.display = 'none'
	document.querySelector('#status > p').textContent = 'Retrying...'

	window.location.reload()
}

document.querySelector('#login > a').onclick = login

document.querySelector('#login > input').addEventListener('keypress', (e) => {
	document.querySelector('#loginError').style.display = 'none'

	if (e.key === 'Enter') {
		login()
	}
})

document.querySelector('#login > input').focus()

document.querySelector('#login > input').value = require('os').userInfo().username.toUpperCase()

const gameState = {
	'players': [],
	'title': {
		'title': '',
		'subtitle': '',
		'boardText': '',
		'displayMode': 0
	},
	'weather': 0, // 0 = clear, 1 = rain
	'background': null,
	'showVoteUI': false,
	'transitioning': false,
	'tamperUI': {
		'display': false,
		'canTamper': true
	},
	'vignette': 80,
	'card': null,
	'teams': [],
	'timer': {
		'display': false,
		'timeLeft': -1
	}
}

abstractor.on('transition', (data) => {
	gameState.transitioning = true
	
	document.querySelector('canvas').style.opacity = 0
	
	setTimeout(() => {
		gameState.transitioning = false
		
		document.querySelector('canvas').style.opacity = 1
	}, data.ms)
})

abstractor.on('title', (data) => {
	gameState.title = data
})

abstractor.on('timer', (data) => {
	gameState.timer = data
})

abstractor.on('setCard', (data) => {
	gameState.card = data
})

abstractor.on('setVoteUI', (data) => {
	gameState.showVoteUI = data.display
})

abstractor.on('setTamperUI', (data) => {
	gameState.tamperUI = data
})

abstractor.on('updateGame', (state) => {
	Object.assign(gameState, state) // weather, background, players
})