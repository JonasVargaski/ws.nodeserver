import SessionService from '../../../services/SessionService';

export default class SessionsController {
    async create(req, res) {
        const { email, password } = req.body;

        const { user, token } = await new SessionService(req).create({
            email,
            password,
        });

        return res.json({ user, token, teste: 'OK' });
    }

    async list(req, res) {
        const users = await new SessionService(req.UserToken).getOnline();
        return res.json(users);
    }
}
