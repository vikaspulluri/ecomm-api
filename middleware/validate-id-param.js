const mongoose = require('mongoose');
const shortId = require('shortid');

module.exports = (req, res, next) => {
    if(!req.params.id || !shortId.isValid(req.params.id)) {
        return res.status(401).send('Id passed in must be a single String of 12 bytes or a string of 24 hex characters');
    }
    return next();
}