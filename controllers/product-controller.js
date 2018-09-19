const Product = require('../models/product-model');
const Category = require('../models/category-model');
const ResponseBuilder = require('../libraries/response-builder');
const shortId = require('shortid');

exports.getCategoryId = (req, res, next) => {
    Category.findOne({slugname: req.body.category})
            .exec()
            .then(result => {
                if(result && result._id) {
                    req.categoryId = result._id;
                    return next();
                }
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Provided Category Not Found')
                                        .status(404)
                                        .errorType('dataValidationError')
                                        .errorCode('PC-GCI-1')
                                        .build();
                return res.status(404).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-GCI-2')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
}

exports.createProduct = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('PC-CP-1')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('You need admin previleges to create/modify a product')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('PC-CP-2')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    const slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
    const body = {
        _id: shortId.generate(),
        name: req.body.name,
        description: req.body.description,
        slugname: slugname,
        createdDate: new Date().toLocaleString(),
        category: req.categoryId,
        price: {
            originalPrice: req.body.price.originalPrice,
            offerPrice: req.body.price.offerPrice ? req.body.price.offerPrice : req.body.price.originalPrice,
            currency: req.body.price.currency ? req.body.price.currency : 'INR'
        },
        createdBy: req.userData.userId
    }
    if(req.body.meta) {
        body.meta = {
            madeIn: req.body.meta.madeIn,
            color: req.body.meta.color,
            dimensions: req.body.meta.dimensions
        }
    }
    const product = new Product(body);
    product.save()
            .then(result => {
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Successfully Created')
                                        .status(201)
                                        .data(result)
                                        .build();
                return res.status(201).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-CP-3')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}

exports.getProducts = (req, res, next) => {
    Product.find()
            .populate('category')
            .exec()
            .then(result => {
                let response = result || [];
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Successfully Fetched')
                                        .status(200)
                                        .data(response)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-GP-1')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}


exports.getProductById = (req, res, next) => {
    Product.findOne({_id: req.params.id})
            .populate('category')
            .exec()
            .then(result => {
                if(!result) {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Product Not Found')
                                        .status(404)
                                        .errorType('DataMissingError')
                                        .errorCode('PC-GPBI-1')
                                        .build();
                return res.status(500).send(jsonResponse)
                }
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Successfully Fetched')
                                        .status(200)
                                        .data(result)
                                        .build();
                return res.status(200).send(jsonResponse)
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-GPBI-2')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}

exports.checkProductExistence = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('PC-CPE-1')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('You need admin previleges to create/modify a product')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('PC-CPE-2')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    const id = req.params.id;
    if(!shortId.isValid(id)) {
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('A Valid Id Must Be Supplied To Edit A Product')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('PC-CPE-3')
                                        .build();
        return res.status(400).send(jsonResponse)
    }
    Product.countDocuments({_id: req.params.id})
            .exec()
            .then(result => {
                if(result <= 0) {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('No Product Found With The Requested Id')
                                        .status(404)
                                        .errorType('DataMissingError')
                                        .errorCode('PC-CPE-4')
                                        .build();
                    return res.status(404).send(jsonResponse)
                }
                return next();
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-CPE-5')
                                        .build();
                res.status(500).send(jsonResponse);
            })
}

exports.updateProduct = (req, res, next) => {
    const body = {
        name: req.body.name,
        description: req.body.description,
        category: req.categoryId,
        lastModifiedOn: new Date().toLocaleDateString(),
        lastModifiedBy: req.userData.userId,
        price: {
            originalPrice: req.body.price.originalPrice,
            offerPrice: req.body.price.offerPrice ? req.body.price.offerPrice : req.body.price.originalPrice,
            currency: req.body.price.currency ? req.body.price.currency : 'INR'
        },
    }
    if(req.body.meta) {
        body.meta = {
            madeIn: req.body.meta.madeIn,
            color: req.body.meta.color,
            dimensions: req.body.meta.dimensions
        }
    } 
    Product.updateOne({_id: req.params.id}, body, {new: true})
            .populate('category')
            .exec()
            .then(result => {
                if(result.n > 0) {
                    let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Successfully Updated')
                                        .status(200)
                                        .build();
                    return res.status(200).send(jsonResponse);    
                }
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Update Failed')
                                        .errorCode('PC-UP-3')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .build();
                return res.status(500).send(jsonResponse); 
                
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-UP-4')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}

exports.deleteProduct = (req, res, next) => {
    Product.deleteOne({_id: req.params.id})
            .then(result => {
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Successfully Deleted')
                                        .status(200)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('PC-DP-3')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}