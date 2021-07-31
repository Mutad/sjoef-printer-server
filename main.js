const { app, Tray, Menu, shell, BrowserWindow } = require("electron")
const ptp = require("pdf-to-printer");
const express = require('express');

const printers = require('./src/printers')
const print = require('./src/print')

const server = express();

const cors = require('cors');
server.use(cors());
server.use(express.json());

server.get('/printers',printers)
server.post('/print',print)

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
server.listen(port,console.log('server started at http://localhost:'+port));

let tray = null;
let win = null;
app.whenReady().then(() => {
  win = new BrowserWindow({ show: false });
  tray = new Tray('logo@4x.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Sjoef panel', type: 'normal', click: () => shell.openExternal('http://www.verzendbeheer-toplock.nl') },
    {
      label: 'Print', type: "normal", click: () => {
        ptp.print('test.pdf')
          .then(console.log)
          .catch(console.log);
        // win.webContents.print(options, (success, errorType) => {
        //   if (!success) console.log(errorType)
        // })
      }
    },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.exit() }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)


})
