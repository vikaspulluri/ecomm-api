const respondOk = (error, statusCode, message, data) => {
    return {
        error: false,
        message: message,
        statusCode: statusCode,
        data: data
    }
}

const respondError = (error, message, statusCode, errCode, data) => {
    return {
        error: error,
        message: message,
        statusCode: statusCode,
        errorCode: errCode,
        data: data
    }
}

module.exports = {
    respondOk: respondOk,
    respondError: respondError
}