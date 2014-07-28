var Marionette = require('marionette-client');
var Hapi = require('hapi');
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
     defaultCallback: function(err, result) {
       console.log('CALLBACK GOT:', err, result);
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
  this.server;
}

WebdriverServer.prototype.connect = function () {
  var deferred = Q.defer();
  
  // start a webdriver server
  this.server = new Hapi.Server('localhost', 8000);
  this.server.start(function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    
    deferred.resolve(this.server.info);
  }.bind(this));
  
  return deferred.promise;
};

WebdriverServer.prototype.register = function (method, client) {
  return method.register(this.server, client);
};

WebdriverServer.prototype.disconnect = function () {
  var deferred = Q.defer();
  
  // start a webdriver server
  this.server = new Hapi.Server('localhost', 8000);
  this.server.stop({timeout: 2000 }, function(err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    
    deferred.resolve();
  });
  
  return deferred.promise;
};

/**
 * WebdriverMarionetteInterface
 */

function WebdriverMarionetteInterface (options) {
  this.options = options;
}

WebdriverMarionetteInterface.prototype.status = {
  register: function (server) {
    server.route({
        method: 'GET',
        path: '/status',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var os = require('os');
    var statusData = {
      build: {	
        version: '0.1.0',
        revision: '#z74539798',
        time: (new Date())
      }, 
      os: {
        arch: os.arch(),
        name: os.platform(),
        version: os.release()
      }
    };
    
    reply(statusData);
  } 
};

WebdriverMarionetteInterface.prototype.session = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    this.client.startSession(function () {
      reply(this.client.session);
    }.bind(this));
  } 
};

WebdriverMarionetteInterface.prototype.sessions = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/sessions',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    if (this.client.actor === null) {
      reply([]);
      return;
    }
    
    reply([{sessionId: this.client.actor, capabilities: this.client.session}]);
  } 
};

WebdriverMarionetteInterface.prototype.session_sessionId = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}',
        handler: this.get.bind(this)
    });
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId?}',
        handler: this.delete.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    reply(this.client.session);
  },

  delete: function (request, reply) {
    var id = request.params.sessionId;
    if (id !== this.client.actor) {
      // set proper statuscode forbidden
      reply();
    }
    
    // yay , this method takes no callback, thank you. NOT.
    this.client.deleteSession();
    reply('');
  }  
};

WebdriverMarionetteInterface.prototype.session_sessionId_timeouts = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/timeouts',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    var _valids = ['script', 'implicit', 'page load'];
    
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    reply(this.client.session);
  },
};

var con = new MarionetteConnector();
var wd = new WebdriverServer();
var wdMaInterface = new WebdriverMarionetteInterface();

con.connect().then(function () {
  console.log('[marionette]: connected');
  wd.connect().then(function (info) {
    console.log('[webdriver]: connected', info);
    con.createClient().then(function (client) {
      
      console.log('[marionette]: client created');
      
      wd.register(wdMaInterface.status, client)
      wd.register(wdMaInterface.session, client);
      wd.register(wdMaInterface.sessions, client);
      wd.register(wdMaInterface.session_sessionId, client);
      wd.register(wdMaInterface.session_sessionId_timeouts, client);
        
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