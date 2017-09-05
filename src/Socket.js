class Socket
{
    constructor(host)
    {
        this.ids = {};
        this.eventToMethods = {
            'open' : 'onopen',
            'close' : 'onclose',
            'error' : 'onerror'
        };
        this.host = host;
        this.socket = new WebSocket(`ws://${this.host}`);

        this.socket.onmessage = (msg) => {
            this.onMessage(msg);
        };
    }

    emit(event, params)
    {
        this.socket.send(JSON.stringify({
            event,
            params
        }));
        console.log(`emit ${event}`);
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
        let data = JSON.parse(message.data);

        if ('undefined' !== typeof data.event && 'undefined' !== typeof this.ids[data.event]) {
            for (let k in this.ids[data.event]) {
                if (this.ids[data.event].hasOwnProperty(k)) {
                    this.ids[data.event][k](data.message);
                }
            }
        }
    }
}
