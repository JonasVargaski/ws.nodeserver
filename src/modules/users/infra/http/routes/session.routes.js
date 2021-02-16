import { Router } from 'express';

import ensureAuthenticate from '../middlewares/ensureAuthenticate';
import SessionsController from '../controllers/SessionController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', sessionsController.create);
sessionsRouter.use(ensureAuthenticate);
sessionsRouter.get('/', sessionsController.list);

export default sessionsRouter;
