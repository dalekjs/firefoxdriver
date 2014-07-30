var which = require('which');
var cp = require('child_process');

function BrowserController(options) {
  this.options = options;

  this.defaultBinaries = {
    default: 'firefox',
    darwin: '/Applications/Firefox.app/Contents/MacOS/firefox-bin',
    win32: process.env.ProgramFiles + '\\Mozilla Firefox\\firefox.exe',
    win64: process.env['ProgramFiles(x86)'] + '\\Mozilla Firefox\\firefox.exe'
  };
};

BrowserController.prototype._getDefaultBinary = function () {
  var platform = process.platform;
  
  // check default binary for linuy
  if (platform !== 'darwin' && platform !== 'win32' && this.defaultBinaries[platform]) {
     return which(this.defaultBinaries.linux);
  }

   // check to see if we are on Windows x64
  if (platform === 'win32' && process.arch === 'x64') {
    platform = 'win64';
  }

  return this.defaultBinaries[platform] ? this.defaultBinaries[platform] : which(this.defaultBinaries.default);
};

BrowserController.prototype.startBrowser = function () {
  var args = args = ['-marionette', '-turbo', '-no-remote', '-url', 'about:blank'];
  var spawn = cp.spawn;
  this.spawned = spawn(this._getDefaultBinary(), args);
  this.spawned.stdout.on('data', function (err, data) {
    console.log(String(data));
  });

  return this;
};

BrowserController.prototype.stopBrowser = function () {
  this.spawned.kill('SIGTERM');
  return this;
};

module.exports = BrowserController; 