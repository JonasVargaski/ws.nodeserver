import ServiceBase from '../../../shared/base/ServiceBase';

export default class ActivityService extends ServiceBase {
    async update(data) {
        this.UserToken.ws.notify('RECEIVE', data);
    }
}
