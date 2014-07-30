
/**
 * WebdriverMarionetteInterface
 */
var firstRun = true;
var con, setClient;

var globl = require('../global');

var webdriveryfiResponse = function (err, value, sessionId) {
  // TODO: proper status handling
  var req = {status: 0};
  
  if (sessionId) {
    req.sessionId = sessionId;
  }
  
  if (value) {
    req.value = value;
  }
  
  return req;
};

function WebdriverMarionetteInterface (options) {
  this.options = options;
  con = this.options.con;
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
    
    reply(webdriveryfiResponse(null, statusData));
  } 
};

WebdriverMarionetteInterface.prototype.session = {
  register: function (server) {
    server.route({
        method: 'POST',
        path: '/session',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    if (firstRun === false) {
      con.connect().then(function () {
        con.createClient().then(function (client) {          
          client.startSession(function () {
            globl.setClient(client);
            reply(webdriveryfiResponse(null, client.session, client.actor));
          }.bind(this));
        }.bind(this));
      }.bind(this));
      return;
    }
    
    globl.getClient().startSession(function () {
      firstRun = false;
      reply(webdriveryfiResponse(null, globl.getClient().session, globl.getClient().actor));
    }.bind(this));
  } 
};

WebdriverMarionetteInterface.prototype.sessions = {
  register: function (server) {
    server.route({
        method: 'GET',
        path: '/sessions',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    if (globl.getClient().actor === null) {
      reply([]);
      return;
    }
    
    reply([{sessionId: globl.getClient().actor, capabilities: globl.getClient().session}]);
  } 
};

WebdriverMarionetteInterface.prototype.session_sessionId = {
  register: function (server) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}',
        handler: this.get
    });
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId}',
        handler: this.delete
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    reply(webdriveryfiResponse(null, globl.getClient().session));
  },

  delete: function (request, reply) {
    var id = request.params.sessionId;
    if (id !== globl.getClient().actor) {
      // set proper statuscode forbidden
      reply();
    }
    
    // yay , this method takes no callback, thank you. NOT.
    globl.getClient().deleteSession();
    reply('');
  }  
};

WebdriverMarionetteInterface.prototype.session_sessionId_timeouts = {
  register: function (server) {
    server.route({
      method: 'POST',
      path: '/session/{sessionId}',
      handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    var _valids = ['script', 'implicit', 'page load'];
    
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // check payload params
    if (!request.payload.ms || !request.payload.type || _valids.indexOf(request.payload.type) === -1) {
      // set proper statuscode 500
      reply();      
    }
    
    if (_valids.indexOf(request.payload.type) === 0) {
      globl.getClient().setScriptTimeout(request.payload.ms, function () {
        reply('');
      });
    }
    
    if (_valids.indexOf(request.payload.type) === 0) {
      globl.getClient().setSearchTimeout(request.payload.ms, function () {
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
  register: function (server) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/timeouts/aync_script',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // check payload params
    if (!request.payload.ms) {
      // set proper statuscode 500
      reply();      
    }
    
    globl.getClient().setScriptTimeout(request.payload.ms, function () {
      reply('');
    });    
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_timeouts_implicit_wait = {
  register: function (server) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/timeouts/implicit_wait',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // check payload params
    if (!request.payload.ms) {
      // set proper statuscode 500
      reply();      
    }
    
    globl.getClient().setSearchTimeout(request.payload.ms, function () {
      reply('');
    });    
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle = {
  register: function (server) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/window_handle',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().getWindow(function (handle) {
      reply(webdriveryfiResponse(null, handle, globl.getClient().actor));
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handles = {
  register: function (server) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/window_handles',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().getWindows(function (handles) {
      reply(webdriveryfiResponse(null, handles, globl.getClient().actor));
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_url = {
  register: function (server) {

    server.route({
        method: 'GET',
        path: '/session/{sessionId}/url',
        handler: this.get
    });
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/url',
        handler: this.post
    });    
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;

    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().getUrl(function (err, url) {
      reply(webdriveryfiResponse(err, url, id));
    }); 
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.url) {
      // set proper statuscode 500
      reply();      
    }    
    
    globl.getClient().goUrl(request.payload.url, function (err, success) {
      reply(webdriveryfiResponse(err, request.payload.url, id));
    }); 
  }  
};

WebdriverMarionetteInterface.prototype.session_sessionId_forward = {
  register: function (server) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/forward',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().goForward(function (done) {
      reply(webdriveryfiResponse(null, done, globl.getClient().actor));
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_back = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/back',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().goBack(function (done) {
      reply(webdriveryfiResponse(null, done, globl.getClient().actor));
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_refresh = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/refresh',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().refresh(function (done) {
      reply(webdriveryfiResponse(null, done, globl.getClient().actor));
    }); 
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_execute = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/execute',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
      reply(webdriveryfiResponse(err, value, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_execute_async = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/execute_async',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
      reply(webdriveryfiResponse(err, value, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_screenshot = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/screenshot',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Needs a wrapper function for return values
     globl.getClient().screenshot(function(err, value) {
      // TODO: Error handling
      reply(webdriveryfiResponse(err, value, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_available_engines = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/ime/available_engines',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    reply(webdriveryfiResponse(null, ['Touch'], globl.getClient().actor));
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_active_engine = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/ime/active_engine',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    reply(webdriveryfiResponse(null, 'Touch', globl.getClient().actor));
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_activated = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/ime/activated',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Return true when on FirefoxOS
    reply(webdriveryfiResponse(null, false, globl.getClient().actor));    
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_deactivate = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/ime/deactivate',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Disable touch inputs when in FirefoxOS
    reply(webdriveryfiResponse(null, true, globl.getClient().actor));
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_ime_activate = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/ime/activate',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Activate touch inputs when in FirefoxOS
    reply(webdriveryfiResponse(null, true, globl.getClient().actor));
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_frame = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/frame',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (request.payload.id === undefined) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Handle null, number cases
    this.switchToFrame(request.payload.id, function () {
      reply(webdriveryfiResponse(null, true, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_frame_parent = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/frame/parent',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (request.payload.id === undefined) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Find out how to get back to the parent context 
    this.switchToFrame(null, function (done) {
      reply(webdriveryfiResponse(null, done, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/window',
        handler: this.post
    });
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId}/window',
        handler: this.delete
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.name) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Find out how to get back to the parent context 
    this.switchToWindow(request.payload.name, function (done) {
      reply(webdriveryfiResponse(null, done, globl.getClient().actor));
    });
  },
  
  delete: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Find out if this works
    this.executeJsScript('return window.close();', function (done) {
      reply(webdriveryfiResponse(null, done, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle_size = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/window/{windowHandle}/size',
        handler: this.post
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/window/{windowHandle}/size',
        handler: this.get
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
    
    var remoteFn = function (width, height) {
       return window.resizeTo(width, height);
    };    
    
    globl.getClient().setContext('chrome');
    globl.getClient().executeScript(remoteFn, [request.payload.width || 1, request.payload.width || 1], function (err, size) {
      globl.getClient().setContext('content');
      reply(webdriveryfiResponse(err, size, globl.getClient().actor));
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    var remoteFn = function () {
       return {width: window.screen.availWidth, height: window.screen.availHeight}
    };
    
    // TODO: Add ability to switch the window handle first, get the dimensions, and then switch back
    globl.getClient().executeScript(remoteFn, [], function (err, size) {
      reply(webdriveryfiResponse(err, size, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle_position = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/window/{windowHandle}/position',
        handler: this.post
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/window/{windowHandle}/position',
        handler: this.get
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Add ability to switch the window handle first, get the dimensions, and then switch back
    this.executeJsScript('return {x: window.screenX, y: window.screenY};', function (size) {
      reply(webdriveryfiResponse(null, size, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_window_handle_maximize = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/window/{windowHandle}/maximize',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    var getSize = function () {
       return {width: window.screen.availWidth, height: window.screen.availHeight}
    };
    
    var setSize = function (width, height) {
       return window.resizeTo(width, height);
    };    
    
    // TODO: Add ability to switch the window handle first, get the dimensions, and then switch back
    globl.getClient().executeScript(getSize, [], function (err, size) {
      globl.getClient().setContext('chrome');
      globl.getClient().executeScript(setSize, [size.width, size.height], function (err, size) {
        globl.getClient().setContext('content');
        reply(webdriveryfiResponse(err, size, globl.getClient().actor));
      });
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_cookie = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/cookie',
        handler: this.post
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/cookie',
        handler: this.get
    });
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId}/cookie',
        handler: this.delete
    });        
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
    if (id !== globl.getClient().actor) {
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
    if (id !== globl.getClient().actor) {
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
    server.route({
        method: 'DELETE',
        path: '/session/{sessionId}/cookie/{name}',
        handler: this.delete
    });
  },
  
  delete: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/source',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().pageSource(function (err, source) {
      reply(webdriveryfiResponse(err, source, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_title = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/title',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    globl.getClient().title(function (err, title) {
      reply(webdriveryfiResponse(err, title, globl.getClient().actor));
    })
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.using || !request.payload.value) {
      // TODO Error handling
      reply();
    }
    
    // with default options
    globl.getClient().findElement(request.payload.value, request.payload.using, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       
       reply(webdriveryfiResponse(err, {ELEMENT: element.id}, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_elements = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/elements',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.using || !request.payload.value) {
      // TODO Error handling
      reply();
    }
    
    // with default options
    globl.getClient().findElements(request.payload.value, request.payload.using, function(err, elements) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       
       var _elements = [];
       elements.forEach(function (elm) {
         _elements.push({ELEMENT: elm.id})
       });
       
       reply(webdriveryfiResponse(err, _elements, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_active = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/active',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.using || !request.payload.value) {
      // TODO Error handling
      reply();
    }
    
    // with default options
    globl.getClient().findElement(':focus', function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       
       reply(webdriveryfiResponse(err, {ELEMENT: element.id}, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}',
        handler: this.get
    });  
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Wait for the spec to specify
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_element = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/{id}/element',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.using || !request.payload.value) {
      // TODO Error handling
      reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
      if (err) {
        reply(webdriveryfiResponse(err, err, globl.getClient().actor));
        return;
      }
       
      element.findElement(request.payload.value, request.payload.using, function(err, child) {
        if (err) {
          reply(webdriveryfiResponse(err, err, globl.getClient().actor));
          return;
        }
        
        reply(webdriveryfiResponse(err, {ELEMENT: child.id}, globl.getClient().actor));
      });
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_elements = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/{id}/elements',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.using || !request.payload.value) {
      // TODO Error handling
      reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
      if (err) {
        reply(webdriveryfiResponse(err, err, globl.getClient().actor));
        return;
      }
       
      element.findElements(request.payload.value, request.payload.using, function(err, children) {
        if (err) {
          reply(webdriveryfiResponse(err, err, globl.getClient().actor));
          return;
        }
        
        var _elements = [];
        children.forEach(function (elm) {
          _elements.push({ELEMENT: elm.id})
        });
        
        reply(webdriveryfiResponse(err, {ELEMENT: child.id}, globl.getClient().actor));
      });
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_click = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/{id}/click',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.click(function (done) {
         if (!done) {
           reply(webdriveryfiResponse('err', done, globl.getClient().actor));
           return;
         }         
         reply('');
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_submit = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/{id}/submit',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }
    
    var remoteFn = function (elm) {
      return elm.submit();
    };
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.scriptWith(remoteFn, function (done) {
         if (!done) {
           reply(webdriveryfiResponse('err', done, globl.getClient().actor));
           return;
         }         
         reply('');
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_text = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/text',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.text(function (text) {
         if (!done) {
           reply(webdriveryfiResponse('err', text, globl.getClient().actor));
           return;
         }         
         reply('');
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_value = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/{id}/value',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }
    
    if (!request.params.value || Array.isArray(request.params.value)) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.sendkeys(request.payload.value, function (text) {
         if (!done) {
           reply(webdriveryfiResponse('err', text, globl.getClient().actor));
           return;
         }         
         reply('');
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_keys = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/keys',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.value || Array.isArray(request.params.value)) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(':focus', function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.sendkeys(request.payload.value, function (text) {
         if (!done) {
           reply(webdriveryfiResponse('err', text, globl.getClient().actor));
           return;
         }         
         reply('');
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_clear = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/element/{id}/clear',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }  
    
    var remoteFn = function (elm) {
      return elm.value = '';
    };    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.scriptWith(remoteFn, function (done) {
         if (!done) {
           reply(webdriveryfiResponse('err', done, globl.getClient().actor));
           return;
         }         
         reply('');
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_selected = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/selected',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.selected(function (err, selected) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }         
         reply(webdriveryfiResponse(null, selected, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_enabled = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/enabled',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.enabled(function (err, enabled) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }         
         reply(webdriveryfiResponse(null, enabled, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_atrribute_name = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/attribute/{name}',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    if (!request.params.name) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.getAttribute(function (err, content) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }
              
         reply(webdriveryfiResponse(null, content, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_equals_other = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/equals/{other}',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    if (!request.params.other) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       
       globl.getClient().findElement(request.params.other, function(err, other) {
          if (err) {
            reply(webdriveryfiResponse(err, err, globl.getClient().actor));
            return;
          }       
       
          element.equals(other, function (err, equals) {
            if (err) {
              reply(webdriveryfiResponse(err, err, globl.getClient().actor));
              return;
            }

            reply(webdriveryfiResponse(null, equals, globl.getClient().actor));
          })
       });
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_displayed = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/displayed',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.displayed(function (err, displayed) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }
              
         reply(webdriveryfiResponse(null, displayed, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_location = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/location',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.location(function (err, location) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }
              
         reply(webdriveryfiResponse(null, location, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_location_in_view = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/location_in_view',
        handler: this.get
    });  
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Wait for the spec to specify
    reply('Not implemented')
  },
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_size = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/size',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.location(function (err, size) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }
              
         reply(webdriveryfiResponse(null, size, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_element_id_css_propertyName = {
  register: function (server, client) {
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/element/{id}/css/{propertyName}',
        handler: this.get
    });
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.params.id) {
      // TODO Error handling
      reply();
    }   
    
    if (!request.params.propertyName) {
      // TODO Error handling
      reply();
    }    
    
    // with default options
    globl.getClient().findElement(request.params.id, function(err, element) {
       if (err) {
         reply(webdriveryfiResponse(err, err, globl.getClient().actor));
         return;
       }
       element.cssProperty(request.params.propertyName, function (err, value) {
         if (err) {
           reply(webdriveryfiResponse(err, err, globl.getClient().actor));
           return;
         }
              
         reply(webdriveryfiResponse(null, value, globl.getClient().actor));
       })
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_orientation = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/orientation',
        handler: this.post
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/orientation',
        handler: this.get
    });  
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    if (!request.payload.windowHandle) {
      // set proper statuscode
      reply();
    }
    
    // TODO: Implement
    // No idea how to hack this yet
    reply('Not implemented')
  },
  
  get: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    var remoteFn = function () {
       return window.orientation;
    };
    
    // TODO: Add ability to switch the window handle first, get the dimensions, and then switch back
    globl.getClient().executeScript(remoteFn, [], function (err, orientation) {
      reply(webdriveryfiResponse(err, orientation, globl.getClient().actor));
    });
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_alert_text = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/alert_text',
        handler: this.post
    });
    server.route({
        method: 'GET',
        path: '/session/{sessionId}/alert_text',
        handler: this.get
    });    
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
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
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_accept_alert = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/accept_alert',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_dismiss_alert = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/dismiss_alert',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_dismiss_alert = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/dismiss_alert',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // Probably Polyfillable using JavaScript (at least to some degree)
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_moveTo = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/moveTo',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_click = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/click',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_buttondown = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/buttondown',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_buttonup = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/buttonup',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_doubleclick = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/doubleclick',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_doubleclick = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/doubleclick',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_click = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/click',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_down = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/down',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_up = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/up',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_scroll = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/scroll',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_doubleclick = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/doubleclick',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_longclick = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/longclick',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

WebdriverMarionetteInterface.prototype.session_sessionId_touch_flick = {
  register: function (server, client) {
    server.route({
        method: 'POST',
        path: '/session/{sessionId}/touch/flick',
        handler: this.post
    });
  },
  
  post: function (request, reply) {
    var id = request.params.sessionId;
    // check for proper sessionId
    if (id !== globl.getClient().actor) {
       // set proper statuscode forbidden
       reply();
    }
    
    // TODO: Implement
    // No idea how to do this because you have no actual mouse cursor control
    reply('Not implemented')
  }
};

module.exports = WebdriverMarionetteInterface;