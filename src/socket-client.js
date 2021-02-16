import socketio from 'socket.io-client';

class WSocket {
    constructor() {
        this.connection = null;
        this.state = {};
    }

    configure({ url = '', state = {} }) {
        this.connection = socketio(url, {
            autoConnect: false,
        });

        this.state = state;
        const connect = async () => {
            if (!this.state.token)
                throw new Error('It is necessary to provide a token');
            this.connection.io.opts.query = this.state;
            this.connection.connect();
        };
        return { connect };
    }

    disconnect() {
        this.connection.disconnect();
    }

    emit(action, data) {
        this.connection.emit(action, data);
    }

    on(event, listener) {
        this.connection.on(event, listener);
    }

    off(event, listener) {
        this.connection.off(event, listener);
    }
}

export default new WSocket();

export const eActions = {
    SEND: 'SEND',
    RECEIVE: 'RECEIVE',
};
