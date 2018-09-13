const jwt = require('jsonwebtoken');
let responseObj = require('../libraries/response');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.id, isAdmin: decodedToken.isAdmin};
    next();
  } catch(error) {
    let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
    return res.status(401).send(jsonResponse);
  }
}
