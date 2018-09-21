const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const jwt = require('jsonwebtoken');


exports.createUser = (req, res, next) => {
    if(!req.body.password){
        let error = new ErrorResponseBuilder('Invalid request')
                                        .errorType('DataValidationError')
                                        .status(400)
                                        .errorCode('UC-CU-1')
                                        .build();
        return next(error);
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
                    let response = new SuccessResponseBuilder('User created successfully!!!')
                                        .status(201)
                                        .data(data)
                                        .build();
                    return res.status(201).send(response);
                })
                .catch(error => {
                    let err = new ErrorResponseBuilder()
                                        .errorCode('UC-CU-2')
                                        .build();
                    return next(err);
                })
            })
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
          if(!user) {
            let error = new ErrorResponseBuilder('Invalid username provided')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-1')
                                        .build();
            return next(error);
          }
          fetchedUser = user;
          return bcrypt.compare(req.body.password, fetchedUser.password);
        })
        .then(result => {
            if(!result){
                let error = new ErrorResponseBuilder('Invalid Authentication Credentials')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-2')
                                        .build();
                return next(error);
            }
            const token = jwt.sign({email: fetchedUser.email, id: fetchedUser._id, isAdmin: fetchedUser.hasAdminPrevilieges}, process.env.JWT_KEY, {expiresIn: '1h'});
            const data = {
                token: token,
                expiryDuration: 3600,
                username: fetchedUser.firstName + ' ' + fetchedUser.lastName,
                userId: fetchedUser._id
            };
            let jsonResponse = new SuccessResponseBuilder('User Logged In Successfully...')
                                        .status(200)
                                        .data(data)
                                        .build();
            return res.status(200).send(jsonResponse);
        })
        .catch(err => {
            let error = new ErrorResponseBuilder()
                                        .errorCode('UC-LU-3')
                                        .build();
            return next(error);
        });
}

exports.getUser = (req, res, next) => {
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
            let jsonResponse = new SuccessResponseBuilder('User Data Fetched Successfully!!!')
                                        .status(200)
                                        .data(data)
                                        .build();
            res.status(200).send(jsonResponse);
        })
        .catch(error => {
            let err = new ErrorResponseBuilder().errorCode('UC-GU-1').build();
            return next(err);
        })
}
