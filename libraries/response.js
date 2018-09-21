module.exports = class Response {
    constructor(builder) {
        this.error = builder.error;
        this.message = builder.message || 'Something went wrong, please try again later!!!';
        this.status = builder.status || 500;
        this.data = builder.data;
        this.errorCode = builder.errorCode;
        this.errorType = builder.errorType || 'UnknownError';
    }
}