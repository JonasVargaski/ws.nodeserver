import Socket from '../index';

import ActivityController from '../../../modules/users/infra/ws/controllers/ActivityController';

const activityController = new ActivityController();

Socket.use('SEND', activityController.register);
