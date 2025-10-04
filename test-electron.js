const { app, BrowserWindow } = require('electron');

console.log('Electron app:', app);
console.log('BrowserWindow:', BrowserWindow);

app.whenReady().then(() => {
  console.log('Electron is ready!');
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });
  
  win.loadFile('src/renderer/index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});