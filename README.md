firefoxdriver
=============

Driver for interfacing the Marionette testing protocol with Webdriver


# Implemented Methods:

[status](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/status) - build info mocked, os version glitchy
[session](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session) - no desiredCapabilities or requiredCapabilities support yet
[sessions](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/sessions) - can only handle one session at the moment
[session/:sessionId](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId) - doesn't handle non existing sessions correct (Need to set the statusCode)
[session/:sessionId/timeouts](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/timeouts)