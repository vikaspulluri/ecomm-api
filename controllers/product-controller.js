const Product = require('../models/product-model');
const Category = require('../models/category-model');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const shortId = require('shortid');
const validateRequest = require('../libraries/validate-request');
const dateUtility = require('../libraries/date-formatter');

exports.getCategoryId = (req, res, next) => {
    let reqValidity = validateRequest(req, 'category');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('PC-GCI-1').build();
        return next(error);
    }
    Category.findOne({slugname: req.body.category})
            .exec()
            .then(result => {
                if(result && result._id) {
                    req.categoryId = result._id;
                    return next();
                }
                let error = new ErrorResponseBuilder('Provided Category Not Found')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('PC-GCI-1')
                                        .build();
                return next(error);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-GCI-2').build();
                return next(err);
            })
}

exports.createProduct = (req, res, next) => {
    let reqValidity = validateRequest(req, 'name','description');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('PC-GCI-1').build();
        return next(error);
    }
    const slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
    const body = {
        _id: shortId.generate(),
        name: req.body.name,
        description: req.body.description,
        slugname: slugname,
        createdDate: dateUtility.formatDate(),
        category: req.categoryId,
        createdBy: req.userData.userId
    }
    if(req.body.price && req.body.price.originalPrice) {
        body.price = {
            originalPrice: req.body.price.originalPrice ? req.body.price.originalPrice : 0,
            offerPrice: req.body.price.offerPrice ? req.body.price.offerPrice : req.body.price.originalPrice,
            currency: req.body.price.currency ? req.body.price.currency : 'INR'
        }
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
                let jsonResponse = new SuccessResponseBuilder('Successfully Created').status(201).data(result).build();
                return res.status(201).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-CP-1').build();
                return next(err);
            })
}

exports.getProducts = (req, res, next) => {
    Product.find()
            .populate('category')
            .exec()
            .then(result => {
                let response = result || [];
                let jsonResponse = new SuccessResponseBuilder('Successfully Fetched').data(response).build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-GP-1').build();
                return next(err);
            })
}


exports.getProductById = (req, res, next) => {
    Product.findOne({_id: req.params.id})
            .populate('category')
            .exec()
            .then(result => {
                if(!result) {
                    let error = new ErrorResponseBuilder('Product Not Found')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('PC-GPBI-1')
                                        .build();
                return next(error);
                }
                let jsonResponse = new SuccessResponseBuilder('Successfully Fetched').data(result).build();
                return res.status(200).send(jsonResponse)
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-GPBI-1').build();
                return next(err);
            })
}

exports.checkProductExistence = (req, res, next) => {
    const id = req.params.id;
    if(!shortId.isValid(id)) {
        let error = new ErrorResponseBuilder('A Valid Id Must Be Supplied To Edit A Product')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('PC-CPE-1')
                                        .build();
        return next(error);
    }
    Product.countDocuments({_id: req.params.id})
            .exec()
            .then(result => {
                if(result <= 0) {
                    let error = new ErrorResponseBuilder()
                                        .message('No Product Found With The Requested Id')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('PC-CPE-2')
                                        .build();
                    return next(error);
                }
                return next();
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-CPE-3').build();
                return next(err);
            })
}

exports.updateProduct = (req, res, next) => {
    let reqValidity = validateRequest(req, 'name','description');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('PC-GCI-1').build();
        return next(error);
    }
    const body = {
        name: req.body.name,
        description: req.body.description,
        category: req.categoryId,
        lastModifiedOn: dateUtility.formatDate(),
        lastModifiedBy: req.userData.userId
    }
    if(req.body.price && req.body.price.originalPrice) {
        body.price = {
            originalPrice: req.body.price.originalPrice,
            offerPrice: req.body.price.offerPrice ? req.body.price.offerPrice : req.body.price.originalPrice,
            currency: req.body.price.currency ? req.body.price.currency : 'INR'
        }
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
                if(result.n <= 0) {
                    let error = new ErrorResponseBuilder('Update Failed')
                                        .errorCode('PC-UP-1')
                                        .status(404)
                                        .errorType('ProductNotFoundError')
                                        .build();
                return next(error);
                }
                let jsonResponse = new SuccessResponseBuilder('Successfully Updated').build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-UP-2').build();
                return next(err);
            })
}

exports.deleteProduct = (req, res, next) => {
    Product.deleteOne({_id: req.params.id})
            .then(result => {
                let jsonResponse = new SuccessResponseBuilder('Successfully Deleted').build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('PC-GP-1').build();
                return next(err);
            })
}