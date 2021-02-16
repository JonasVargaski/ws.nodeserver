import { Router } from 'express';

import ensureAuthenticate from '../middlewares/ensureAuthenticate';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticate);
profileRouter.put('/', profileController.update);

export default profileRouter;
