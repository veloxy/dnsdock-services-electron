const electron = require('electron'),
  app = electron.app,
  menu = electron.Menu,
  tray = electron.Tray,
  http = require('http'),
  path = require('path'),
  shell = require('electron').shell,
  browserWindow = require('electron').BrowserWindow,
  ncp = require("copy-paste");
//path = require('path');

var menuTray = null,
  window = null,
  menuItems = [
    {
      label: 'Quit Application',
      click: function () {
        app.quit()
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
  menuTray = new tray(path.join(__dirname, 'assets/img/icon.png'));
  menuTray.setTitle('');

  var dnsDockMenuItems = [];

  http.get('http://dnsdock.docker/services', function (res) {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      var json = JSON.parse(body);
      for (var key in json) {
        var menuItem = {
          'label': json[key].Name
        };

        //if (json[key].Aliases.length) {
          menuItem.submenu = [];
        //}

        menuItem.submenu.push({
          label: json[key].Ip,
          click: function (menuItem) {
            ncp.copy(menuItem.label);
          }
        });

        for (var alias in json[key].Aliases) {
          menuItem.submenu.push({
            label: json[key].Aliases[alias],
            click: function (menuItem) {
              var link = 'http://' + menuItem.label;
              shell.openExternal(link);
            }
          });
        }

        dnsDockMenuItems.push(menuItem);
      }
console.log(menuItems)
      for (i = 0; i < menuItems.length; ++i) {
        console.log(menuItem)
        dnsDockMenuItems.push(menuItems[i]);
      }

      menuTray.setContextMenu(menu.buildFromTemplate(dnsDockMenuItems));
    });
  }).on('error', function (e) {
    console.log("Got an error: ", e);
  });


  menuTray.setContextMenu(menu.buildFromTemplate(menuItems));
}