import { hash } from 'bcryptjs';
import ServiceBase from '../../../shared/base/ServiceBase';

import UsersRepository from '../repositories/UsersRepository';

export default class UserService extends ServiceBase {
    async update(data) {
        this.UserToken.ws.notify('TESTE', data);
        this.UserToken.ws.to([123]).notify('TESTE', { ...data, to: 'ok' });
        this.UserToken.ws.broadcast('TESTE', { ...data, broadcast: 'ok' });
        return this.UserToken;
    }

    findByEmail({ email }) {
        return new UsersRepository().findByEmail({ email });
    }

    async create({ email, name, password }) {
        const hashPassword = await hash(password, 8);

        const user = await new UsersRepository().create({
            name,
            email,
            password: hashPassword,
        });

        delete user.password;
        return user;
    }
}
