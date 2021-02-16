import UserService from '../../../services/UserService';

export default class UsersController {
    async create(req, res) {
        const { email, password, name } = req.body;

        const resp = await new UserService(req.UserToken).create({
            name,
            email,
            password,
        });

        return res.json(resp);
    }
}
