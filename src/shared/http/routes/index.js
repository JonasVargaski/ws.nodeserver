import { Router } from 'express';
import sessionsRouter from '../../../modules/users/infra/http/routes/session.routes';
import profileRouter from '../../../modules/users/infra/http/routes/profile.routes';
import usersRouter from '../../../modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/profile', profileRouter);
routes.use('/users', usersRouter);

export default routes;
