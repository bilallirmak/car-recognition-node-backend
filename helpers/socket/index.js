class Socket {

    constructor() {
        // this.socket = null
        this.nsp = null;
    }

    init(io) {
        this.io = io;
        this.nsp = io.of('/test');
        this.connect();
    }

    connect() {
        this.nsp.on('connection', async socket => {
            // this.socket = socket
            console.log("Connected to Socket");

        })
    }

    dataEmit(data) {
        this.nsp.emit('data', data)

    }
}

module.exports = new Socket();