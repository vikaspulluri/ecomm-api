const jwt = require('jsonwebtoken');
let ResponseBuilder = require('../libraries/response-builder');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.id, isAdmin: decodedToken.isAdmin};
    next();
  } catch(error) {
    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('CA-1')
                                        .build();
    return res.status(401).send(jsonResponse);
  }
}
