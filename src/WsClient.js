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

    current()
    {
        this.emit('current', "");
    }

    identify(data)
    {
        this.emit('identify', data);
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
