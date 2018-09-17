const mongoose = require('mongoose');
const ResponseBuilder = require('../libraries/response-builder');
const config = require('../config/dev.config');

module.exports = function(model, field) {
    return function(req, res, next) {
        model.countDocuments({[field]: req.body[field]})
             .exec()
             .then(docsCount => {
                if(docsCount > 0) {
                    let response = new ResponseBuilder().error(true)
                                        .message(config.messages.errors[field].validation)
                                        .status(400)
                                        .errorType('duplicateDataError')
                                        .errorCode('UV-1')
                                        .build();
                    return res.status(400).send(response);
                }
                next();
             })
             .catch(error => {
                let response = new ResponseBuilder().error(true)
                                        .message(config.messages.errors.unknown)
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('UV-2')
                                        .build();
                return res.status(500).send(response);
            })
    }
}
