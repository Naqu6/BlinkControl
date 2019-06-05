const { app, BrowserWindow } = require('electron');
const path = require('path')
const os = require("os");

let win;

function createWindow () {
	BrowserWindow.addDevToolsExtension(
		path.join(os.homedir(), '/Library/Application\ Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0')
	);
	
	win = new BrowserWindow({
		width: 1400,
		height: 1000,
		webPreferences: {
			nodeIntegration: true
		},
		titleBarStyle: "hidden"
	});

	win.loadFile('src/app.html');

	win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});