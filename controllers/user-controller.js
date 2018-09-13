const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const responseObj = require('../libraries/response');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
    if(!req.body.password){
        let response = responseObj.respondError(true, 'Invalid request', 400, 'dataValidationError');
        return res.status(400).send(response);
    }
    const date = new Date().toLocaleString();
    const isAdmin = (req.headers.isadmin) ? true : false;
    bcrypt.hash(req.body.password, 12)
            .then(hash => { 
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    createdDate: date,
                    hasAdminPrevilieges: isAdmin,
                    phone: req.body.phone,
                    address: {
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country,
                        pin: req.body.pin
                    }
                });
                user.save()
                .then(result => {
                    let data = {
                        userId: result._id,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: result.email,
                        phone: result.phone,
                        address: result.address
                    };
                    let jsonResponse = responseObj.respondOk(false, 201, 'User created successfully!', data);
                    res.status(201).send(jsonResponse);
                })
                .catch(error => {
                    let jsonResponse = responseObj.respondError(true, 'Invalid data provided', 400, 'dataValidationError');
                    res.status(500).send(jsonResponse);
                })
            })
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
          if(!user) {
            let jsonResponse = responseObj.respondError(true, 'Invalid username provided', 401, 'OAuthError');
            return res.status(401).send(jsonResponse);
          }
          fetchedUser = user;
          return bcrypt.compare(req.body.password, fetchedUser.password);
        })
        .then(result => {
            if(!result){
                let jsonResponse = responseObj.respondError(true, 'Invalid authentication credentials', 401, 'OAuthError');
                return res.status(401).send(jsonResponse);
            }
            const token = jwt.sign({email: fetchedUser.email, id: fetchedUser._id, isAdmin: fetchedUser.hasAdminPrevilieges}, process.env.JWT_KEY, {expiresIn: '1h'});
            const data = {
                token: token,
                expiryDuration: 3600,
                username: fetchedUser.firstName + ' ' + fetchedUser.lastName,
                userId: fetchedUser._id
            };
            let jsonResponse = responseObj.respondOk(false, 201, 'User loggedin successfully!', data);
            res.status(200).send(jsonResponse);
        })
        .catch(err => {
            let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
            return res.status(401).send(jsonResponse);
        });
  }

exports.getUser = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = responseObj.respondError(true, 'Authentication failed!', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    User.findById(req.userData.userId)
        .exec()
        .then(result => {
            let data = {
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phone: result.phone,
                createdOn: result.createdDate,
                address: result.address,
                orders: result.orders
            }
            let jsonResponse = responseObj.respondOk(false, 201, 'User info successully fetched', data);
            res.status(200).send(jsonResponse);
        })
        .catch(error => {
            let jsonResponse = responseObj.respondError(true, 'Something went wrong while fetching data', 401, 'UnknownError');
            return res.status(500).send(jsonResponse);
        })
}

exports.getCartInfo = (req, res, next) => {
    res.status(201).json({
        message: 'get cart'
    })
}