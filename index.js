var ClientStateHandler = require('./lib/clientStateHandler');
var WebdriverServer = require('./lib/webdriverServer');
var MarionetteConnector = require('./lib/marionetteConnector');
var WebdriverMarionetteInterface = require('./lib/commands');

var con = new MarionetteConnector();
var wd = new WebdriverServer();
var wdMaInterface = new WebdriverMarionetteInterface({con: con});

var registerAll = function (wdMaInterface) {
  Object.keys(WebdriverMarionetteInterface.prototype).forEach(function (key) {
    wd.register(wdMaInterface[key])
  });
};

wd.connect().then(function (info) {
  registerAll(wdMaInterface);
  console.log('All running, good to go!');
});