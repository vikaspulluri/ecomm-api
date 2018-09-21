const Response = require('./response');

class ErrorResponseBuilder extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.error = true;
    }
    status(sCode) {
        this.status = sCode;
        return this;
    }
    data(data) {
        this.data = data;
        return this;
    }
    errorCode(errCode) {
        this.errorCode = errCode;
        return this;
    }
    errorType(errType) {
        this.errorType = errType;
        return this;
    }
    build() {
        return new Response(this);
    }
}

class SuccessResponseBuilder {
    constructor(message) {
        this.message = message;
        this.error = false;
    }
    error(err) {
        this.error = err;
        return this;
    }
    status(sCode) {
        this.status = sCode;
        return this;
    }
    data(data) {
        this.data = data;
        return this;
    }
    errorCode(errCode) {
        this.errorCode = errCode;
        return this;
    }
    errorType(errType) {
        this.errorType = errType;
        return this;
    }
    build() {
        return new Response(this);
    }
}

module.exports = {
    ErrorResponseBuilder,
    SuccessResponseBuilder
}