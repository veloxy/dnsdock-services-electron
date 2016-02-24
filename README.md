# DNSDock Dock

Simple little app that displays dnsdock services in a tray on OSX.

- Clicking links opens it in your browser of choice
- Clicking IP's will copy it to clipboard

![Screenshot](https://sourcebox-screenshots.s3.eu-central-1.amazonaws.com/Screen%20Shot%202016-02-24%20at%208.39.55%20PM.jpg)

## Building from source

### Requirements

Following are needed to build the OSX .app file.

- [electron-packager](https://github.com/maxogden/electron-packager)

#### Optional

Following are only needed to create a .dmg installer for OSX.

- [node-appdmg](https://github.com/LinusU/node-appdmg)

### Building

Before creating the .app file, you need to install the dependencies:

```
npm install
```

When dependencies are installed, you can build the .app with electron packager:

```
electron-packager ./ DNSDockDock --platform=darwin --arch=all --version=0.36.7 --out=./build --ignore build --overwrite --icon=src/assets/icons/icon.icns
```

To build the installer, run:

```
appdmg appdmg.json build/DNSDockDock-darwin-x64.dmg
```
