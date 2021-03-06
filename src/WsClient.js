class WsClient
{
    constructor(host, protocol = 'ws', setActive = true)
    {
        var self = this;
        this.ids = {};
        this.eventToMethods = {
            'open'  : 'onopen',
            'close' : 'onclose',
            'error' : 'onerror'
        };
        this.protected = [
            'current', 'identify'
        ];
        this.host = host;
        this.protocol = protocol;
        this.socket = new WebSocket(`${this.protocol}://${this.host}`);

        this.socket.onmessage = (msg) => {
            this.onMessage(msg);
        };

        if (setActive) {
            window.addEventListener('focus', function() {
                self.current();
            });
        }
    }

    emit(event, data)
    {
        if (this.protected.indexOf(event) !== -1) {
            return false;
        }
        this.socket.send(JSON.stringify({
            event,
            data,
        }));
    }

    on(event, listener)
    {
        if ('function' === typeof listener) {
            if ('undefined' !== typeof this.eventToMethods[event]) {
                this[this.eventToMethods[event]](listener);
            } else {
                this.ids[event] = this.ids[event] || [];
                this.ids[event].push(listener);
            }
        } else {
            throw new Error(`The listener you want to register has to be a valid JavaScript function. ${typeof listener} given`);
        }
    }
    current(data)
    {
        let event = 'current';
        this.socket.send(JSON.stringify({event, data}));
    }

    identify(data)
    {
        let event = 'identify';
        this.socket.send(JSON.stringify({event, data}));
    }

    onopen(callback)
    {
        this.socket.onopen = callback;
    }

    onclose(callback)
    {
        this.socket.onclose = callback;
    }

    onerror(callback)
    {
        this.socket.onerror = callback;
    }

    onMessage(message)
    {
        try {
            var data = JSON.parse(message.data);
        } catch(e) {
            throw new Error(`Unknown message format`);
        }

        if ('undefined' !== typeof data.event && 'undefined' !== typeof this.ids[data.event]) {
            for (let key in this.ids[data.event]) {
                if (this.ids[data.event].hasOwnProperty(key)) {
                    this.ids[data.event][key](data.data);
                }
            }
        }
    }
}

export default WsClient;