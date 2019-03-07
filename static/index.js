const path = require('path')
const fs = require('fs')
const net = require('net')
const os = require('os')

const {Schema, types, StreamingAbstractor, protospec} = require('protocore')

var sy=function sy(tag,attribs,children){if(!tag)throw new Error("Missing tag argument.");var gen=document.createElement(tag);if(attribs)Object.keys(attribs).forEach(function(attrib){return gen.setAttribute(attrib,attribs[attrib])});if(children)children.forEach(function(child){return child!==null?gen.appendChild(typeof child==="string"?document.createTextNode(child):child):null});return gen};

const protocolSpec = fs.readFileSync(path.join(__dirname, 'protocol.pspec'))

const abstractorFactory = () => protospec.importAbstractor(protocolSpec)

const abstractor = abstractorFactory()

const client = net.createConnection(8080)

client.pipe(abstractor)
abstractor.pipe(client)

abstractor.send('login', {
	'name': os.userInfo().username.toLowerCase()
})

const gameState = {
	'players': []
}

abstractor.on('updateGame', (state) => {
	gameState.players = state.players
})