import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from '../../config/upload';
import routes from './routes';
import Socket from '../ws';
import '../ws/routes';

import AppError from '../errors/AppError';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use((err, request, response, _) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: err.message,
        stack: err.stack,
    });
});

const server = app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log('🚀️ Server started on port 3333!\r\n');
});

Socket.init(server);
