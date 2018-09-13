const mongoose = require('mongoose');
const responseObj = require('../libraries/response');
const config = require('../config/dev.config');

module.exports = function(model, field) {
    return function(req, res, next) {
        model.countDocuments({[field]: req.body[field]})
             .exec()
             .then(docsCount => {
                if(docsCount > 0) {
                    let response = responseObj.respondError(true, config.messages.errors[field].validation, 400, 'dataValidationError', {[field]: req.body[field]});
                    return res.status(400).send(response);
                }
                next();
             })
             .catch(error => {
                let response = responseObj.respondError(true, config.messages.errors.unknown, 500, 'unknownError', '');
                return res.status(500).send(response);
            })
    }
}
