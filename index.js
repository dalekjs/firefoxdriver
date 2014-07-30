var Marionette = require('marionette-client');
var Hapi = require('hapi');
var Q = require('q');

var globl = require('./lib/global');

var _globals = {};

/**
 * MarionetteConnector
 */

function MarionetteConnector (options) {
  this.options = options;
}

MarionetteConnector.prototype.connect = function () {
  var deferred = Q.defer();
  
  // interface with the  marionette framework using the TCP driver
  this.driver = new Marionette.Drivers.Tcp({});
  this.driver.connect(function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    
    deferred.resolve();
  });
  
  return deferred.promise;
};

MarionetteConnector.prototype.createClient = function () {
  var deferred = Q.defer();
  this.client = new Marionette.Client(this.driver, {
     defaultCallback: function(err, result) {
       //console.log('CALLBACK GOT:', err, result);
     }
  });
  deferred.resolve(this.client);
  return deferred.promise;  
};

MarionetteConnector.prototype.disconnect = function () {
  var deferred = Q.defer();
  this.driver.close();
  deferred.resolve();
  return deferred.promise;
};

/**
 * WebdriverServer
 */

function WebdriverServer (options) {
  this.options = options;
  this.server = new Hapi.Server('localhost', 8000, {debug: {
    request: ['error']
  }});
}

WebdriverServer.prototype.connect = function () {
  var deferred = Q.defer();
  
  // start a webdriver server
  this.server.start(function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    
    deferred.resolve(this.server.info);
  }.bind(this));
  
  return deferred.promise;
};

WebdriverServer.prototype.register = function (method) {
  return method.register(this.server);
};

WebdriverServer.prototype.disconnect = function () {
  var deferred = Q.defer();
  
  // start a webdriver server
  this.server.stop({timeout: 2000}, function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    
    deferred.resolve();
  });
  
  return deferred.promise;
};

var registerAll = function (wdMaInterface) {
  Object.keys(WebdriverMarionetteInterface.prototype).forEach(function (key) {
    wd.register(wdMaInterface[key])
  });
};


var WebdriverMarionetteInterface = require('./lib/commands/cmds');
var con = new MarionetteConnector();
var wd = new WebdriverServer();
var wdMaInterface = new WebdriverMarionetteInterface({con: con});

con.connect().then(function () {
  console.log('[marionette]: connected');
    con.createClient().then(function (client) {
      console.log('[marionette]: client created');
      globl.setClient(client);
      registerAll(wdMaInterface);
      wd.connect().then(function (info) {
        console.log('[webdriver]: connected');
    });
  });
})

  /*con.disconnect().then(function () {
    console.log('[marionette]: diconnected');
    wd.disconnect().then(function (info) {
      console.log('[webdriver]: disconnected');
      process.exit(0);
    });
  });*/

  /*var remote = function () {
    if (document.readyState === 'complete') {
      marionetteScriptFinished({ fromRemote: true });
      return;
    }

    window.addEventListener('DOMContentLoaded', function() {
      // special method to notify that async script is complete.
      marionetteScriptFinished({ fromRemote: true })
    });
  }

  client.startSession(function () {
    client.goUrl('http://nightlybuild.io')
          .executeAsyncScript(remote, function(err, value) {
            console.log(err, value);
          })
          .title(function () {
            console.log('TITLE', arguments);
          })

          .deleteSession();
  });
  
});*/