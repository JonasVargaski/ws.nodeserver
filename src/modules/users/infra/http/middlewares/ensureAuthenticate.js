import { verify } from 'jsonwebtoken';

import authConfig from '../../../../../config/auth';
import AppError from '../../../../../shared/errors/AppError';
import Socket from '../../../../../shared/ws';

export default function ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const UserToken = JSON.parse(decoded.sub);
        Socket.inject(UserToken);

        req.UserToken = UserToken;
        return next();
    } catch (err) {
        throw new AppError('Invalid JWT token', 401);
    }
}
