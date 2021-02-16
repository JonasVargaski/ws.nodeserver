class AppError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default AppError;
