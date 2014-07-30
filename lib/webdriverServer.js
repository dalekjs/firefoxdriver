var Hapi = require('hapi');
var Q = require('q');

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
  
  // stop the webdriver server
  this.server.stop({timeout: 2000}, function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    
    deferred.resolve();
  });
  
  return deferred.promise;
};

module.exports = WebdriverServer;