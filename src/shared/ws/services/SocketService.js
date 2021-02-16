import ServiceBase from '../../base/ServiceBase';
import Socket from '../index';

export default class SocketService extends ServiceBase {
    getOnline() {
        return Socket.list();
    }
}
