const ResponseBuilder = require('../libraries/response-builder');
const shortId = require('shortid');

module.exports = (req, res, next) => {
    if(!req.params.id || !shortId.isValid(req.params.id)) {
        let jsonResponse = new ResponseBuilder().error(true)
            .message('Invalid Id Provided')
            .status(400)
            .errorType('dataValidationError')
            .errorCode('VIP-1')
            .build();
        return res.status(401).send(jsonResponse);
    }
    return next();
}