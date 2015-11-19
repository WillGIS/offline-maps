var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // set mapnik font path environment variable
  process.env['MAPNIK_FONT_PATH'] = './resources/fonts';
  
  // call tessera
  var tessera = require('child_process').spawn('./node_modules/tessera/bin/tessera.js', ['--port', '3000', 'tmstyle://' + __dirname + '/resources/tiles.tm2']);
  
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 800});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;

    // kill tessera
    tessera.kill('SIGINT');
  });
});
