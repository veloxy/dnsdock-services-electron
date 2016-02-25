const electron = require('electron'),
  app = electron.app,
  menu = electron.Menu,
  tray = electron.Tray,
  path = require('path'),
  shell = require('electron').shell,
  dnsdockServiceUpdater = require('./libs/dnsdock-service-updater.js'),
  browserWindow = require('electron').BrowserWindow,
  ncp = require("copy-paste");

var menuTray = null,
  window = null,
  menuItems = [
    {
      type: 'separator'
    },
    {
      label: 'Quit Application',
      click: function () {
        app.quit();
      },
    }
  ];

app.dock.hide();

app.on('ready', function () {
  window = new browserWindow({width: 1, height: 1, show: false, skipTaskbar: true});
  window.loadURL('file://' + __dirname + '/index.html');
  window.webContents.on('did-finish-load', init);
});

function init() {
  menuTray = new tray(path.join(__dirname, 'assets/img/trayTemplate.png'));
  menuTray.setTitle('');
  menuTray.setContextMenu(menu.buildFromTemplate(menuItems));

  dnsdockServiceUpdater.start();

  dnsdockServiceUpdater.on('services-updated', function(services) {
    var dnsDockMenuItems = [];

    for (var key in services) {
      var menuItem = {
        'label': services[key].Name
      };

      menuItem.submenu = [];
      menuItem.submenu.push({
        label: services[key].Ip,
        click: copyIp
      });

      for (var alias in services[key].Aliases) {
        menuItem.submenu.push({
          label: services[key].Aliases[alias],
          click: openUrl
        });
      }

      dnsDockMenuItems.push(menuItem);
    }

    dnsDockMenuItems.sort((a, b) => a.label.localeCompare(b.label));

    for (i = 0; i < menuItems.length; ++i) {
      dnsDockMenuItems.push(menuItems[i]);
    }

    menuTray.setContextMenu(menu.buildFromTemplate(dnsDockMenuItems));
  });
}

function copyIp(menuItem) {
  ncp.copy(menuItem.label);
}

function openUrl(menuItem) {
  var link = 'http://' + menuItem.label;
  shell.openExternal(link);
}