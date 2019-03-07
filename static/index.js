const path = require('path')
const fs = require('fs')
const net = require('net')

const {Schema, types, StreamingAbstractor, protospec} = require('protocore')

var sy=function sy(tag,attribs,children){if(!tag)throw new Error("Missing tag argument.");var gen=document.createElement(tag);if(attribs)Object.keys(attribs).forEach(function(attrib){return gen.setAttribute(attrib,attribs[attrib])});if(children)children.forEach(function(child){return child!==null?gen.appendChild(typeof child==="string"?document.createTextNode(child):child):null});return gen};

const protocolSpec = fs.readFileSync(path.join(__dirname, 'protocol.pspec'))

const abstractorFactory = () => protospec.importAbstractor(protocolSpec)

const abstractor = abstractorFactory()

const client = new net.Socket()

client.pipe(abstractor)
abstractor.pipe(client)

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

client.connect(8080, () => {
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

document.querySelector('#login > button').onclick = login

document.querySelector('#login > input').addEventListener('keypress', (e) => {
	document.querySelector('#loginError').style.display = 'none'

	if (e.key === 'Enter') {
		login()
	}
})

const gameState = {
	'players': [],
	'title': {
		'title': '',
		'subtitle': ''
	}
}

abstractor.on('title', (data) => {
	gameState.title = data
})

abstractor.on('updateGame', (state) => {
	gameState.players = state.players
})