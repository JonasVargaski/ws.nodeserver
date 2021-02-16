import io from 'socket.io';
import SessionService from '../../modules/users/services/SessionService';

function Connection(ioContext) {
    return {
        broadcast: (event, payload) => ioContext.emit(event, payload),
        notify: () => {},
        to: (userIds = []) => ({
            notify: (event, payload) => {
                const ids = Array.isArray(userIds) ? userIds : [userIds];
                ids.forEach(id => ioContext.to(id).emit(event, payload));
            },
        }),
        online: false,
        userId: null,
        sessions: [],
    };
}

function Session(socket, content) {
    return {
        id: socket.id,
        adress: socket.handshake.adress,
        date: socket.handshake.time,
        agent: socket.handshake.headers['user-agent'],
        ...content,
    };
}

class WebSocket {
    constructor() {
        this.clients = {};
        this.handlers = [];
    }

    init(server) {
        this.io = io().listen(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        this.middlewares();
        this.listen();
    }

    middlewares() {
        this.io.use(async (socket, next) => {
            const { token } = socket.handshake.query;
            try {
                const UserToken = new SessionService().getUserTokenFromJWT({
                    token,
                });
                // eslint-disable-next-line no-param-reassign
                socket.UserToken = UserToken;
                return next();
            } catch (err) {
                return next(err);
            }
        });
    }

    async listen() {
        this.io.on('connection', async socket => {
            this.register(socket);

            this.handlers.forEach(({ event, handler }) => {
                socket.on(event, data => {
                    const UserToken = { ...socket.UserToken };
                    this.inject(UserToken);
                    handler.call({ UserToken }, data);
                });
            });
            socket.on('disconnect', () => this.remove(socket));
        });
    }

    use(event, handler) {
        this.handlers.push({ event, handler });
    }

    inject(UserToken) {
        // eslint-disable-next-line no-param-reassign
        UserToken.ws = this.find(UserToken.id);
    }

    find(userId) {
        return this.clients[userId] || new Connection(this.io);
    }

    list() {
        return Object.values(this.clients).filter(x => x.online);
    }

    register(socket) {
        const { UserToken } = socket;

        let client = this.find(UserToken.id);

        if (!client.online) {
            client = new Connection(this.io);

            client.online = true;
            client.userId = UserToken.id;
            client.sessions = [new Session(socket)];
            client.broadcast = (event, payload) => this.io.emit(event, payload);
            client.to = (userIds = []) => ({
                notify: (event, payload) => {
                    const ids = Array.isArray(userIds) ? userIds : [userIds];
                    ids.forEach(id => this.io.to(id).emit(event, payload));
                },
            });
            client.notify = (event, payload) =>
                this.io.to(UserToken.id).emit(event, payload);
        } else {
            client.sessions.push(new Session(socket));
            client.online = true;
        }

        this.clients[UserToken.id] = client;
        // eslint-disable-next-line no-param-reassign
        socket.join(UserToken.id);
    }

    remove(socket) {
        const { UserToken } = socket;
        const client = this.find(UserToken.id);

        if (client && client.sessions.length > 1) {
            client.sessions = client.sessions.filter(x => x.id !== socket.id);
            this.clients[UserToken.id] = client;
        } else {
            delete this.clients[UserToken.id];
        }
    }
}

export default new WebSocket();
