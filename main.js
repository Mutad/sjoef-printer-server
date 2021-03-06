const { app, Tray, Menu, shell, BrowserWindow, nativeImage } = require("electron")
const ptp = require("pdf-to-printer");
const path = require('path');
const express = require('express');

const printers = require('./src/printers')
const print = require('./src/print')

const server = express();

const cors = require('cors');
server.use(cors());
server.use(express.json());

server.get('/printers', printers)
server.get('/status', (req,res) => { res.send('{version: 0.1}') });
server.post('/print', print)

const port = 1337;
server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

let tray = null;
let win = null;
app.whenReady().then(() => {
  console.log('hello world');
  win = new BrowserWindow({ show: false });
  // tray = new Tray('logo@4x.png');
  const iconPath = path.join(__dirname, 'logo@4x.png');
  console.log(iconPath);
  tray = new Tray(nativeImage.createFromPath(iconPath));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Sjoef panel', type: 'normal', click: () => shell.openExternal('http://www.verzendbeheer-toplock.nl') },
    // {
    //   label: 'Print', type: "normal", click: () => {
    //     ptp.print('test.pdf')
    //       .then(console.log)
    //       .catch(console.log);
    //     // win.webContents.print(options, (success, errorType) => {
    //     //   if (!success) console.log(errorType)
    //     // })
    //   }
    // },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.exit() }
  ])
  tray.setToolTip('Sjoef printer server.')
  tray.setContextMenu(contextMenu)


})

server.listen(port, console.log('server started at http://localhost:' + port));
