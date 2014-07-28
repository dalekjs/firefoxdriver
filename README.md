firefoxdriver
=============

Driver for interfacing the Marionette testing protocol with Webdriver


# Implemented Methods:

[status](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/status) - build info mocked, os version glitchy

[session](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session) - no desiredCapabilities or requiredCapabilities support yet

[sessions](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/sessions) - can only handle one session at the moment

[session/:sessionId](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId) - doesn't handle non existing sessions correct (Need to set the statusCode)

[session/:sessionId/timeouts](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/timeouts) - page timeout not yet available

[session/:sessionId/timeouts/async_script](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/timeouts/async_script)

[session/:sessionId/timeouts/implicit_wait](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/timeouts/implicit_wait)

[/session/:sessionId/window_handle](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window_handle)

[/session/:sessionId/window_handles](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/window_handles)

[GET /session/:sessionId/url](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/url)

[POST /session/:sessionId/url](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/url)

[/session/:sessionId/forward](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/forward)

[/session/:sessionId/back](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/back)

[/session/:sessionId/refresh](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/refresh)

[/session/:sessionId/execute](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute)

[/session/:sessionId/execute_async](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/execute_async) - needs an wrapper function to be webdriver compliant

[/session/:sessionId/screenshot](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/screenshot)

[/session/:sessionId/ime/available_engines](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/ime/available_engines) - mocked, only Touch engine available

[/session/:sessionId/ime/active_engine](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/ime/active_engine) - mocked, only Touch engine available

[/session/:sessionId/ime/active_engine](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/ime/active_engine) - mocked, only Touch engine available

[/session/:sessionId/ime/deactivate](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/ime/deactivate) - mocked, only Touch engine available -> need to deactivate touch input on FirefoxOS

[/session/:sessionId/ime/activate](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/ime/activate) - mocked, only Touch engine available -> need to activate touch input on FirefoxOS

[/session/:sessionId/frame](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/frame)

[session/:sessionId/frame/parent](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/frame/parent) - Not sure if this works

[POST /session/:sessionId/window](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window)

[DELETE /session/:sessionId/window](https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/window)

[GET /session/:sessionId/window/:windowHandle/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/size) - only works for the current window handle atm.

[GET /session/:sessionId/window/:windowHandle/position](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/position) - only works for the current window handle atm.

[GET /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie)

[POST /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie)

[DELETE /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie)

[/session/:sessionId/source](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/source)

[/session/:sessionId/title](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/title)

# Unsupported
[POST /session/:sessionId/window/:windowHandle/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/size) - probably solvable using a dynamically injected plugin -> http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugin

[POST /session/:sessionId/window/:windowHandle/position](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/position) - probably solvable using a dynamically injected plugin -> http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugin

[POST /session/:sessionId/window/:windowHandle/maximize](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/maximize) - probably solvable using a dynamically injected plugin -> http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugin

[GET /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie) -> Probably Polyfillable using JavaScript (at least to some degree)

[POST /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie) -> Probably Polyfillable using JavaScript (at least to some degree)

[DELETE /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie) -> Probably Polyfillable using JavaScript (at least to some degree)

[DELETE /session/:sessionId/cookie/:name](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/cookie/:name) -> Probably Polyfillable using JavaScript (at least to some degree)
