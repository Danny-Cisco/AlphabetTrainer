const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = false;

let mainWindow;
// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       nodeIntegration: true,
//     },
//   });

//   // If we are in development, use the server.
//   // If we are built, load the index.html file directly.
//   // const isDev = !app.isPackaged;

//   if (isDev) {
//     mainWindow.loadURL("http://localhost:3000");
//   } else {
//     // This matches your vite.config.ts outDir
//     mainWindow.loadFile(path.join(__dirname, "dist/public/index.html"));
//   }

//   mainWindow.on("closed", function () {
//     mainWindow = null;
//   });
// }

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      // If you don't have a preload.js file, comment this line out!
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const isDev = false; // Testing production mode

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    // This uses your specific outDir from vite.config
    mainWindow.loadFile(path.join(__dirname, "dist/public/index.html"));
  }

  // ADD THIS LINE to see exactly what's failing in the blank window
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}
app.on("ready", createWindow);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
