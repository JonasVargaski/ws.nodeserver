import { sign, verify } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import AppError from '../../../shared/errors/AppError';
import UserService from './UserService';
import SocketService from '../../../shared/ws/services/SocketService';

import authConfig from '../../../config/auth';

export default class SessionsService {
    async create({ email, password }) {
        const user = await new UserService().findByEmail({
            email,
        });

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        delete user.password;

        const token = sign({}, secret, {
            subject: JSON.stringify(user),
            expiresIn,
        });

        return {
            user,
            token,
        };
    }

    getUserTokenFromJWT({ token }) {
        try {
            const decoded = verify(token, authConfig.jwt.secret);
            const UserToken = JSON.parse(decoded.sub);

            return UserToken;
        } catch (err) {
            throw new AppError('Invalid JWT token', 401);
        }
    }

    getOnline() {
        return new SocketService(this.UserToken).getOnline();
    }
}
