const User = require('../models/user-model');
const bcrypt = require('bcryptjs');

exports.createUser = (req, res, next) => {
    if(!req.body.password){
        return res.status(500).json({
            error: true,
            message: 'Password must be present in the request'
        });
    }
    const date = new Date().toLocaleString();
    const isAdmin = (req.headers.isadmin) ? true : false;
    const phone = Array.isArray(req.body.phone) ? req.body.phone : [];
    bcrypt.hash(req.body.password, 12)
            .then(hash => { 
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    createdDate: date,
                    hasAdminPrevilieges: isAdmin,
                    phone: phone,
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
                    res.status(201).json({
                        error: false,
                        message: 'User created successfully!!!',
                        data: {
                            userId: result._id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            email: result.email,
                            phone: result.phone,
                            address: result.address
                        }
                    })
                    .catch(error => {
                        res.status(500).json({
                            error: true,
                            errorObj: error,
                            message: 'Invalid data provided. Make sure you are providing correct data!!!'
                        })
                    })
                })
                    
            })
}

exports.loginUser = (req, res, next) => {
    res.status(201).json({
        message: 'login'
    })
}

exports.getUser = (req, res, next) => {
    res.status(201).json({
        message: 'get user'
    })
}

exports.getCartInfo = (req, res, next) => {
    res.status(201).json({
        message: 'get cart'
    })
}