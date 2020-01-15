const path = require('path')

const args = require('gar')(process.argv.slice(2))

const {app, BrowserWindow, Menu} = require('electron')

app.on('ready', () => {
	const win = new BrowserWindow({
		'title': 'Evidential',
		'webPreferences': {
			'nodeIntegration': true
		},
		'width': 1920 * (0.8),
		'height': 1080 * (0.8),
		'resizable': false,
		'fullscreen': true
	})

	const menuTemplate = [
		{
			'label': 'File',
			'submenu': [
				/*{
					'role': 'toggleFullScreen'
				},
				*/{
					'role': 'quit'
				}
			]
		}
	]

	if (args.debug === true) {
		menuTemplate[0].submenu.push({
			'role': 'toggleDevTools'
		})
	}

	const barMenu = Menu.buildFromTemplate(menuTemplate)

	win.setMenu(barMenu)

	win.loadURL('file://' + path.join(__dirname, 'static', 'index.html'))
	
	win.on('close', () => {
		console.log('Window closed.')
		
		process.exit(1)
	})
})