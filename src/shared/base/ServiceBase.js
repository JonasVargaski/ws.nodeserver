import AppError from '../errors/AppError';

interface Session {
    id: String,
    date: String,
    agent: String
}

interface Notify {
    notify(event:String, payload:any):void
}

export interface IUserToken {
    name: String,
    id: String,
    email: String,
    ws: {
      online: Boolean,
      userId: String,
      sessions: Array<Session>,
      broadcast(event:String, payload:any):void,
      notify(event:String, payload:any):void,
      to(usersId?:Array<String>): Notify
    }
}

interface IServiceBase {
    UserToken: UserToken
}

export default class ServiceBase implements IServiceBase {
    UserToken: IUserToken;

    constructor(UserToken: IUserToken) {
        if (UserToken && !UserToken.id)
            throw new AppError('UserToken is not provided', 500);

        this.UserToken = UserToken;
    }
}
