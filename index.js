var Marionette = require('marionette-client');
var Hapi = require('hapi');
var Q = require('q');

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
      reply({status: 0, sessionId: this.client.actor, value: this.client.session});
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
      path: '/session/{sessionId?}',
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
    
    // check payload params
    if (!request.payload.ms || !request.payload.type || _valids.indexOf(request.payload.type) === -1) {
      // set proper statuscode 500
      reply();      
    }
    
    if (_valids.indexOf(request.payload.type) === 0) {
      this.client.setScriptTimeout(request.payload.ms, function () {
        reply('');
      });
    }
    
    if (_valids.indexOf(request.payload.type) === 0) {
      this.client.setSearchTimeout(request.payload.ms, function () {
        reply('');
      });      
    }
    
    if (_valids.indexOf(request.payload.type) === 0) {
      _globals.pageTimeout = request.payload.ms;
      reply('');
    }
    
  },
};

WebdriverMarionetteInterface.prototype.session_sessionId_timeouts_async_script = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/timeouts/aync_script',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // check payload params
    if (!request.payload.ms) {
      // set proper statuscode 500
      reply();      
    }
    
    this.client.setScriptTimeout(request.payload.ms, function () {
      reply('');
    });    
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_timeouts_implicit_wait = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/timeouts/implicit_wait',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // check payload params
    if (!request.payload.ms) {
      // set proper statuscode 500
      reply();      
    }
    
    this.client.setSearchTimeout(request.payload.ms, function () {
      reply('');
    });    
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/window_handle',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.getWindow(function (handle) {
      reply(handle);
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handles = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/window_handles',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.getWindows(function (handles) {
      reply(handles);
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_url = {
  register: function (server, client) {
    this.client = client;
    
    console.log(this.get);
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/url',
        handler: this.get.bind(this)
    });
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/url',
        handler: this.post.bind(this)
    });    
  },
  
  get: function (request, reply) {
    console.log('called');
    var id = request.params.sessionId;
    
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.getUrl(function (url) {
      reply(url);
    }); 
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.url) {
      // set proper statuscode 500
      reply();      
    }    
    
    this.client.goUrl(request.payload.url, function () {
      reply(request.payload.url);
    }); 
  }  
};

WebdriverMarionetteInterface.prototype.session_sessionId_forward = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/forward',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.goForward(function (done) {
      reply(done);
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_back = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/back',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.goBack(function (done) {
      reply(done);
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_refresh = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/refresh',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.refresh(function (done) {
      reply(done);
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_execute = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/execute',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    var remoteFn = request.payload.script; 
    var remoteArgs = request.payload.args || [];
    
    if (!remoteFn) {
      // set proper statuscode 500
      reply();      
    }
    
    client.executeJsScript(remoteFn, remoteArgs, function(err, value) {
      // TODO: Error handling
      reply(value);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_execute_async = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/execute_async',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    var remoteFn = request.payload.script; 
    var remoteArgs = request.payload.args || [];
    
    if (!remoteFn) {
      // set proper statuscode 500
      reply();      
    }
    
    // TODO: Needs a wrapper function for return values
    client.executeAsyncScript(remoteFn, remoteArgs, function(err, value) {
      // TODO: Error handling
      reply(value);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_screenshot = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/screenshot',
        handler: this.post.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Needs a wrapper function for return values
    client.screenshot(function(err, value) {
      // TODO: Error handling
      reply(value);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_available_engines = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/ime/available_engines',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    reply(['Touch']);
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_active_engine = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/ime/active_engine',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    reply('Touch');
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_activated = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/ime/activated',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Return true when on FirefoxOS
    reply(false);
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_deactivate = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/ime/deactivate',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Disable touch inputs when in FirefoxOS
    reply(true);
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_activate = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/ime/activate',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Activate touch inputs when in FirefoxOS
    reply(true);
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_frame = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/frame',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (request.payload.id === undefined) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Handle null, number cases
    this.switchToFrame(request.payload.id, function () {
      reply(true);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_frame_parent = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/frame/parent',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (request.payload.id === undefined) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Find out how to get back to the parent context 
    this.switchToFrame(null, function (done) {
      reply(done);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/window',
        handler: this.post.bind(this)
    });
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId?}/window',
        handler: this.delete.bind(this)
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.name) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Find out how to get back to the parent context 
    this.switchToWindow(request.payload.name, function (done) {
      reply(done);
    });
  },
  
  delete: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Find out if this works
    this.executeJsScript('return window.close();', function (done) {
      reply(done);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle_size = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/window/{windowHandle?}/size',
        handler: this.post.bind(this)
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/window/{windowHandle?}/size',
        handler: this.get.bind(this)
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // Solution from: https://twitter.com/malinidas/status/493796569846939648
    // session.set_context("chrome")' then 'session.execute_script("window.resizeTo(your_width, your_height);")'
    
    // Bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=1045103
    
    // TODO: Implement
    // probably solvable using a dynamically injected plugin -> 
    // http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugi
    reply('Not implemented')
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Add ability to switch the window handle first, get the dimensions, and then switch back
    this.executeJsScript('return {width: window.screen.availWidth, height: window.screen.availHeight};', function (size) {
      reply(size);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle_position = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/window/{windowHandle?}/position',
        handler: this.post.bind(this)
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/window/{windowHandle?}/position',
        handler: this.get.bind(this)
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Implement
    // probably solvable using a dynamically injected plugin -> 
    // http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugi
    reply('Not implemented')
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Add ability to switch the window handle first, get the dimensions, and then switch back
    this.executeJsScript('return {x: window.screenX, y: window.screenY};', function (size) {
      reply(size);
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle_maximize = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/window/{windowHandle?}/maximize',
        handler: this.post.bind(this)
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Implement
    // probably solvable using a dynamically injected plugin -> 
    // http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugi
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_cookie = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'POST',
        path: '/session/{sessionId?}/cookie',
        handler: this.post.bind(this)
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/cookie',
        handler: this.get.bind(this)
    });
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId?}/cookie',
        handler: this.delete.bind(this)
    });        
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }

    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }

    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  },
  
  delete: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }

    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  }  
};

WebdriverMarionetteInterface.prototype.session_sessionId_cookie_name = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId?}/cookie/{name?}',
        handler: this.delete.bind(this)
    });
  },
  
  delete: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.name) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_source = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/source',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.pageSource(function (source) {
      reply(source)
    })
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_title = {
  register: function (server, client) {
    this.client = client;
    server.route({
        method: 'GET',
        path: '/session/{sessionId?}/title',
        handler: this.get.bind(this)
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== this.client.actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    this.client.title(function (title) {
      reply(title)
    })
  }
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
      
      wd.register(wdMaInterface.status, client);
      wd.register(wdMaInterface.session, client);
      //wd.register(wdMaInterface.sessions, client);
      //wd.register(wdMaInterface.session_sessionId, client);
      //wd.register(wdMaInterface.session_sessionId_timeouts, client);
      //wd.register(wdMaInterface.session_sessionId_async_script, client);
      //wd.register(wdMaInterface.session_sessionId_timeouts_implicit_wait, client);
      //wd.register(wdMaInterface.session_sessionId_window_handle, client);
      //wd.register(wdMaInterface.session_sessionId_window_handles, client);
      wd.register(wdMaInterface.session_sessionId_url, client);
      /*wd.register(wdMaInterface.session_sessionId_forward, client);
      wd.register(wdMaInterface.session_sessionId_back, client);
      wd.register(wdMaInterface.session_sessionId_refresh, client);
      wd.register(wdMaInterface.session_sessionId_execute, client);
      wd.register(wdMaInterface.session_sessionId_execute_async, client);
      wd.register(wdMaInterface.session_sessionId_screenshot, client);
      wd.register(wdMaInterface.session_sessionId_ime_available_engines, client);
      wd.register(wdMaInterface.session_sessionId_ime_active_engine, client);
      wd.register(wdMaInterface.session_sessionId_ime_activated, client);
      wd.register(wdMaInterface.session_sessionId_ime_deactivate, client);
      wd.register(wdMaInterface.session_sessionId_ime_activate, client);
      wd.register(wdMaInterface.session_sessionId_frame, client);
      wd.register(wdMaInterface.session_sessionId_frame_parent, client);
      wd.register(wdMaInterface.session_sessionId_window, client);
      wd.register(wdMaInterface.session_sessionId_window_handle_size, client);
      wd.register(wdMaInterface.session_sessionId_cookie, client);
      wd.register(wdMaInterface.session_sessionId_cookie_name, client);
      wd.register(wdMaInterface.session_sessionId_source, client);
      wd.register(wdMaInterface.session_sessionId_title, client);*/
        
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