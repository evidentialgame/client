const path = require('path')

const {app, BrowserWindow} = require('electron')

app.on('ready', () => {
	const win = new BrowserWindow({
		'webPreferences': {
			'nodeIntegration': true
		},
		'width': 1920 * (0.8),
		'height': 1080 * (0.8),
		'resizable': false,
		'title': 'Evidential'
	})

	win.loadURL('file://' + path.join(__dirname, 'static', 'index.html'))
	
	win.on('close', () => {
		console.log('Window closed.')
		
		process.exit(1)
	})
})