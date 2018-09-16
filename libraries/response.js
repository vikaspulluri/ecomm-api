module.exports = class Response {
    constructor(builder) {
        this.error = builder.error;
        this.message = builder.message;
        this.statusCode = builder.status;
        this.data = builder.data;
        this.errorCode = builder.errorCode;
        this.errorType = builder.errorType;
    }
}