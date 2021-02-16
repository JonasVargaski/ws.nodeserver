import UserService from '../../../services/UserService';

export default class ProfileController {
    async update(req, res) {
        const { email, password, name, avatarUrl } = req.body;

        const resp = await new UserService(req.UserToken).update({
            email,
            password,
            name,
            avatarUrl,
        });

        return res.json(resp);
    }
}
