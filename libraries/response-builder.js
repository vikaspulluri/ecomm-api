const Response = require('./response');

module.exports = class ResponseBuilder {
    constructor() {}
    error(err) {
        this.error = err;
        return this;
    }
    message(msg) {
        this.message = msg;
        return this;
    }
    status(sCode) {
        this.statusCode = sCode;
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


