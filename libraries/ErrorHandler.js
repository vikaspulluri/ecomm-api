class ApplicationError extends Error {
    constructor(code, message, status, type){
        super(message);
        this.name = this.constructor.name;
        this.message = message || 'Something went wrong, please try again later!!!';
        this.status = status || 500;
        this.errorCode = code;
        this.errorType = type || 'UnknownError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApplicationError;