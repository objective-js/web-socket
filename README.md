# WebSocket

## Modifications

This repository contains a JavaScript class in `src/WsClient.js`. This class is an ES6 class.

In order to use it in systems that does not yet understand ES6 features, a build is present in `dist/WsClient.js`.

If you modify the class, don't forget to build it in ES5 with this king of command:

`babel src/WsClient.js --out-file dist/WsClient.js --presets es2015`

## Usage

You can use the WebSocket client like this:

```javascript
let socket = new WsClient('127.0.0.1:8889');

// waiting that the handshake is done and that we're connected to the wss
socket.on('open', function (message) {
	socket.emit('my.event', 'My event content'); // an example to emit an event
});
```
