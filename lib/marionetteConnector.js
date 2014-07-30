var Marionette = require('marionette-client');
var Q = require('q');

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
     defaultCallback: function() {}
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

module.exports = MarionetteConnector;