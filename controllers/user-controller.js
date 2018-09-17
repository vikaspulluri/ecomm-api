const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const ResponseBuilder = require('../libraries/response-builder');
const jwt = require('jsonwebtoken');


exports.createUser = (req, res, next) => {
    if(!req.body.password){
        let response = new ResponseBuilder().error(true)
                                        .message('Invalid request')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('UC-CU-1')
                                        .build();
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
                    let response = new ResponseBuilder().error(false)
                                        .message('User created successfully!!!')
                                        .status(201)
                                        .data(data)
                                        .build();
                    return res.status(201).send(response);
                })
                .catch(error => {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknwonError')
                                        .errorCode('UC-CU-2')
                                        .build();
                    return res.status(500).send(jsonResponse);
                })
            })
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
          if(!user) {
            let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Invalid username provided')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-1')
                                        .build();
            return res.status(401).send(jsonResponse);
          }
          fetchedUser = user;
          return bcrypt.compare(req.body.password, fetchedUser.password);
        })
        .then(result => {
            if(!result){
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Invalid Authentication Credentials')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-2')
                                        .build();
                return res.status(401).send(jsonResponse);
            }
            const token = jwt.sign({email: fetchedUser.email, id: fetchedUser._id, isAdmin: fetchedUser.hasAdminPrevilieges}, process.env.JWT_KEY, {expiresIn: '1h'});
            const data = {
                token: token,
                expiryDuration: 3600,
                username: fetchedUser.firstName + ' ' + fetchedUser.lastName,
                userId: fetchedUser._id
            };
            let jsonResponse = new ResponseBuilder().error(false)
                                        .message('User Logged In Successfully...')
                                        .status(200)
                                        .data(data)
                                        .build();
            return res.status(200).send(jsonResponse);
        })
        .catch(err => {
            let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(500)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-3')
                                        .build();
            return res.status(500).send(jsonResponse);
        });
}

exports.getUser = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-GU-1')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    User.findById(req.userData.userId)
        .exec()
        .then(result => {
            let data = {
                userId: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phone: result.phone,
                createdOn: result.createdDate,
                address: result.address,
                orders: result.orders
            }
            let jsonResponse = new ResponseBuilder().error(false)
                                        .message('User Data Fetched Successfully!!!')
                                        .status(200)
                                        .data(data)
                                        .build();
            res.status(200).send(jsonResponse);
        })
        .catch(error => {
            let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('UC-GU-2')
                                        .build();
            return res.status(500).send(jsonResponse);
        })
}

