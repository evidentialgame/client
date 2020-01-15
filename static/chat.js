// Load after index.js

let lastTyped = 0
let typingCurrently = false

const setTyping = (typing) => {
	if (typing !== typingCurrently) {
		abstractor.send('setTyping', {
			'typing': typing
		})
		
		typingCurrently = typing
	}
}

abstractor.on('message', (data) => {
	const chatArea = document.querySelector('#messages')
	
	const messageComponents = []
	
	data.segments.forEach((seg) => {
		messageComponents.push(sy('p', {'class': 'chatSegment', 'style': 'color: ' + seg.color + ';'}, [seg.text]))
	})
	
	chatArea.appendChild(sy('div', {'class': 'message'}, messageComponents))
	
	chatArea.scrollTop = chatArea.scrollHeight
})

abstractor.on('suggestSend', (data) => {
	document.querySelector('#messageBox').value = data.content
	
	document.querySelector('#messageBox').focus()
})

document.querySelector('#messageBox').addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		const messageBox = document.querySelector('#messageBox')
		
		abstractor.send('sendChat', {
			'message': messageBox.value
		})
		
		messageBox.value = ''
		
		setTyping(false)
	}
})

document.querySelector('#messageBox').addEventListener('input', (e) => {
	setTyping(true)
	
	lastTyped = Date.now()
	
	setTimeout(() => {
		if (lastTyped < Date.now() - 1500) {
			setTyping(false)
		}
	}, 2000)
})

document.querySelector('#messageBox').addEventListener('blur', (e) => {
	setTyping(false)
})

document.addEventListener('blur', (e) => {
	setTyping(false)
})

document.addEventListener('keypress', (e) => {
	const messageBox = document.querySelector('#messageBox')

	const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
	
	if ((e.key === 'Enter' || letters.includes(e.key))&& document.activeElement !== messageBox) {
		messageBox.focus()
	}
})