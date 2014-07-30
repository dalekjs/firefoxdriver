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

[POST /session/:sessionId/window/:windowHandle/maximize](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/maximize) -> with workaround

[GET /session/:sessionId/window/:windowHandle/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/size) - only works for the current window handle atm.

[POST /session/:sessionId/window/:windowHandle/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/size) -> with workaround


[GET /session/:sessionId/window/:windowHandle/position](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/window/:windowHandle/position) - only works for the current window handle atm.

[GET /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie)

[POST /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie)

[DELETE /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie)

[/session/:sessionId/source](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/source)

[/session/:sessionId/title](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/title)

[/session/:sessionId/element](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element)

[/session/:sessionId/elements](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/elements)

[/session/:sessionId/element/active](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/active)

[/session/:sessionId/element/:id/element](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/element)

[/session/:sessionId/element/:id/elements](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/elements)

[/session/:sessionId/element/:id/click](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/element/:id/click)

[/session/:sessionId/element/:id/submit](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/submit)

[/session/:sessionId/element/:id/text](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/text)

[/session/:sessionId/element/:id/value](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value)

[/session/:sessionId/keys](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/keys)

[/session/:sessionId/element/:id/clear](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/clear)

[/session/:sessionId/element/:id/selected](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/selected)

[/session/:sessionId/element/:id/enabled](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/enabled)

[/session/:sessionId/element/:id/attribute/:name](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/attribute/:name)

[/session/:sessionId/element/:id/equals/:other](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/equals/:other)

[/session/:sessionId/element/:id/displayed](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/displayed)

[/session/:sessionId/element/:id/location](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/location)

[/session/:sessionId/element/:id/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/size)

[/session/:sessionId/element/:id/css/:propertyName](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/css/:propertyName)

[GET /session/:sessionId/orientation](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/orientation)

[/session/:sessionId/location](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/location) -> needs some settings in the profile to get around security restriction (until then, it does only work when the location has been set before from Dalek)

[/session/:sessionId/local_storage](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/local_storage)

[/session/:sessionId/local_storage/key/:key](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/local_storage/key/:key)

[/session/:sessionId/local_storage/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/local_storage/size)

[/session/:sessionId/session_storage](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/session_storage)

[/session/:sessionId/session_storage/key/:key](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/session_storage/key/:key)

[/session/:sessionId/session_storage/size](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/session_storage/size)


# Unsupported
[POST /session/:sessionId/window/:windowHandle/position](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/window/:windowHandle/position) - probably solvable using a dynamically injected plugin -> http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugin

 - probably solvable using a dynamically injected plugin -> http://mozilla-b2g.github.io/marionette-js-client/api-docs/classes/Marionette.Client.html#method_plugin

[GET /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/cookie) -> Probably Polyfillable using JavaScript (at least to some degree)

[POST /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/cookie) -> Probably Polyfillable using JavaScript (at least to some degree)

[DELETE /session/:sessionId/cookie](https://code.google.com/p/selenium/wiki/JsonWireProtocol#DELETE_/session/:sessionId/cookie) -> Probably Polyfillable using JavaScript (at least to some degree)

[DELETE /session/:sessionId/cookie/:name](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/cookie/:name) -> Probably Polyfillable using JavaScript (at least to some degree)

[GET session/:sessionId/element/:id](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id) -> not yet specified in the spec

[GET /session/:sessionId/element/:id/location_in_view](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/element/:id/location_in_view) -> could be mocked by using clientside executed javascript

[POST /session/:sessionId/orientation](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/orientation)

[GET /session/:sessionId/alert_text](https://code.google.com/p/selenium/wiki/JsonWireProtocol#GET_/session/:sessionId/alert_text)
-> maybe override the alert() & dialog() methods in JS

[POST /session/:sessionId/alert_text](https://code.google.com/p/selenium/wiki/JsonWireProtocol#POST_/session/:sessionId/alert_text)
-> maybe override the alert() & dialog() methods in JS

[POST /session/:sessionId/accept_alert](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/accept_alert)
-> maybe override the alert() & dialog() methods in JS

[POST /session/:sessionId/dismiss_alert](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/dismiss_alert)
-> maybe override the alert() & dialog() methods in JS

[POST /session/:sessionId/moveto](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/moveto) -> No way to control the mouse cursor

[POST /session/:sessionId/buttonup](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/buttonup) -> No way to control the mouse cursor

[POST /session/:sessionId/buttondown](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/buttondown) -> No way to control the mouse cursor

[POST /session/:sessionId/doubleclick](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/doubleclick) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/click](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/click) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/down](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/down) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/up](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/up) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/move](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/move) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/scroll](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/scroll) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/doubleclick](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/doubleclick) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/longclick](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/longclick) -> No way to control the mouse cursor

[POST /session/:sessionId/touch/flick](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/touch/flick) -> Probably pollyfillable with client side scrolling