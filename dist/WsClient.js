'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WsClient = function () {
    function WsClient(host) {
        var _this = this;

        var protocol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ws';
        var setActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        _classCallCheck(this, WsClient);

        var self = this;
        this.ids = {};
        this.eventToMethods = {
            'open': 'onopen',
            'close': 'onclose',
            'error': 'onerror'
        };
        this.host = host;
        this.protocol = protocol;
        this.socket = new WebSocket(this.protocol + '://' + this.host);

        this.socket.onmessage = function (msg) {
            _this.onMessage(msg);
        };

        if (setActive) {
            window.addEventListener('focus', function () {
                self.current();
            });
        }
    }

    _createClass(WsClient, [{
        key: 'emit',
        value: function emit(event, data) {
            this.socket.send(JSON.stringify({
                event: event,
                data: data
            }));
        }
    }, {
        key: 'on',
        value: function on(event, listener) {
            if ('function' === typeof listener) {
                if ('undefined' !== typeof this.eventToMethods[event]) {
                    this[this.eventToMethods[event]](listener);
                } else {
                    this.ids[event] = this.ids[event] || [];
                    this.ids[event].push(listener);
                }
            } else {
                throw new Error('The listener you want to register has to be a valid JavaScript function. ' + (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) + ' given');
            }
        }
    }, {
        key: 'current',
        value: function current() {
            this.emit('current', "");
        }
    }, {
        key: 'identify',
        value: function identify(data) {
            this.emit('identify', data);
        }
    }, {
        key: 'onopen',
        value: function onopen(callback) {
            this.socket.onopen = callback;
        }
    }, {
        key: 'onclose',
        value: function onclose(callback) {
            this.socket.onclose = callback;
        }
    }, {
        key: 'onerror',
        value: function onerror(callback) {
            this.socket.onerror = callback;
        }
    }, {
        key: 'onMessage',
        value: function onMessage(message) {
            try {
                var data = JSON.parse(message.data);
            } catch (e) {
                throw new Error('Unknown message format');
            }

            if ('undefined' !== typeof data.event && 'undefined' !== typeof this.ids[data.event]) {
                for (var key in this.ids[data.event]) {
                    if (this.ids[data.event].hasOwnProperty(key)) {
                        this.ids[data.event][key](data.data);
                    }
                }
            }
        }
    }]);

    return WsClient;
}();

exports.default = WsClient;
