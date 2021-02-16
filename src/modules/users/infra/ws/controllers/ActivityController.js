import ActivityService from '../../../services/ActivityService';

export default class ActivityController {
    register(data) {
        new ActivityService(this.UserToken).update(data);
    }
}
