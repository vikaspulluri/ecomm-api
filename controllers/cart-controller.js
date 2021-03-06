const Cart = require('../models/cart-model');
const Inventory = require('../models/inventory-model');
const shortId = require('shortid');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const validateRequest = require('../libraries/validate-request');
const dateUtility = require('../libraries/date-formatter');
const logger = require('../libraries/log-message');

exports.checkInventoryAvailability = (req, res, next) => {
    if(!req.body.productId || !shortId.isValid(req.body.productId)) {
        let error = new ErrorResponseBuilder('Valid Product Id Should Be Supplied')
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-CIA-1')
                                        .build();
        return next(error);
    }
    Inventory.findOne({product: req.body.productId})
            .exec()
            .then(result => {
                if(!result || !result.product) {
                    let error = new ErrorResponseBuilder('Product Not Found In The Inventory')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('CC-CIA-1')
                                        .build();
                    return next(error);
                }
                req.body.stockLimit = result.availableStock;
                req.body.stockStatus = result.inventoryStatus;
                return next();
            })
            .catch(error => {
                logger.log(error, req, 'CC-CIA');
                let err = new ErrorResponseBuilder().errorCode('CC-CIA-2').status(500).errorType('UnknownError').build();
                return next(err);
            })
}

exports.checkIsProductActiveInCart = (req, res, next) => {
    Cart.countDocuments({user: req.userData.userId, item: req.body.productId})
        .exec()
        .then(result => {
            if(result <= 0) {
                req.isProductActiveInCart = false;
            }else {
                req.isProductActiveInCart = true;
            }
            next();
        })
}


exports.addItem2Cart = (req, res, next) => {
    let reqValidity = validateRequest(req, 'quantity','productId');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('CC-AI2C-1').build();
        return next(error);
    }
    if(req.body.quantity > 25) {
        let error = new ErrorResponseBuilder('You Cannot Add More Than 25 Products To Cart At Once')
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-AI2C-2')
                                        .build();
        return next(error);
    }
    if(req.body.stockStatus === 'inactive') {
        let error = new ErrorResponseBuilder('The Product is Either Inactive Or Running Out Of Stock')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('CC-AI2C-3')
                                        .build();
        return next(error);
    }
    if(req.body.stockLimit < req.body.quantity) {
        let message = `There are only ${req.body.stockLimit} products left in stock and you cannot add more than that`;
        let error = new ErrorResponseBuilder(message)
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-AI2C-4')
                                        .build();
        return next(error);
    }
    const item = {
        item: req.body.productId,
        quantity: req.body.quantity,
        user: req.userData.userId,
        activeStatus: 'active',
        activeDuration: dateUtility.formatDate()
    };
    if(req.isProductActiveInCart && req.isProductActiveInCart === true) {
        Cart.updateOne({item: req.body.productId, user: req.userData.userId}, item, {new: true})
            .then(result => {
                if(result.n <= 0) {
                    let error = new ErrorResponseBuilder('Unable To Add The Item To Cart')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-AI2C-5')
                                        .build();
                    return next(error);
                }
                let jsonResponse = new SuccessResponseBuilder('Item Added To Cart Successfully!!!').build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                logger.log(error, req, 'CC-AI2C');
                let err = new ErrorResponseBuilder().errorCode('CC-AI2C-6').status(500).errorType('UnknownError').build();
                return next(err);
            })
    } else {
        item.createdDate =  dateUtility.formatDate();
        const cart = new Cart(item);
        cart.save()
            .then(result => {
                let jsonResponse = new SuccessResponseBuilder('Item Added To Cart Successfully!!!').build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                logger.log(error, req, 'CC-AI2C');
                let err = new ErrorResponseBuilder().errorCode('CC-AI2C-6').status(500).errorType('UnknownError').build();
                return next(err);
            })
    }
    
}

exports.getActiveCart = (req, res, next) => {
    Cart.find({user: req.userData.userId, activeStatus: 'active'})
        .populate(['item'])
        .exec()
        .then(result => {
            let data = [];
            if(result) {
              data = result.map((cartItem) => {    
                let obj = {};
                    obj.item = cartItem.item.name;
                    obj.id = cartItem.item._id;
                    obj.quantity = cartItem.quantity;
                    //obj.activeDuration = dateUtility.duration(new Date(cartItem.createdDate));
                    obj.sku = cartItem.item.sku;
                    obj.activeStatus = cartItem.activeStatus;
                    return obj;
                })
            }
            let jsonResponse = new SuccessResponseBuilder('Successfully retrieved the cart data!!!').data(data).build();
            return res.status(200).send(jsonResponse)
        })
        .catch(error => {
            logger.log(error, req, 'CC-GAC');
            let err = new ErrorResponseBuilder().errorCode('CC-GAC-1').status(500).errorType('UnknownError').build();
            return next(err);
        })
}

exports.getCartHistory = (req, res, next) => {
    Cart.find({user: req.userData.userId, activeStatus: 'inactive'})
        .populate(['item'])
        .exec()
        .then(result => {
            let data = [];
            if(result) {
              data = result.map((cartItem) => {    
                let obj = {};
                    obj.item = cartItem.item.name;
                    obj.id = cartItem.item._id;
                    obj.quantity = cartItem.quantity;
                    //obj.activeDuration = dateUtility.duration(new Date(cartItem.createdDate));
                    obj.sku = cartItem.item.sku;
                    obj.activeStatus = cartItem.activeStatus;
                    return obj;
                })
            }
            let jsonResponse = new SuccessResponseBuilder('Successfully retrieved the cart data!!!').data(result).build();
            return res.status(200).send(jsonResponse)
        })
        .catch(error => {
            logger.log(error, req, 'CC-GCH');
            let err = new ErrorResponseBuilder().errorCode('CC-GCH-1').status(500).errorType('UnknownError').build();
            return next(err);
        })
}

exports.updateCartItem = (req, res, next) => {
    let reqValidity = validateRequest(req, 'quantity','productId');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('CC-AI2C-1').build();
        return next(error);
    }
    if(req.body.quantity > 25) {
        let error = new ErrorResponseBuilder('You Cannot Add More Than 25 Products To Cart At Once')
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-UCI-1')
                                        .build();
        return next(error);
    }
    
    if(req.body.stockLimit < req.body.quantity) {
        let message = `There are only ${req.body.stockLimit} products left in stock and you cannot add more than that`;
        let error = new ErrorResponseBuilder(message)
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-UCI-2')
                                        .build();
        return next(error);
    }
    
    const item = {
        item: req.body.productId,
        quantity: req.body.quantity,
        activeDuration: dateUtility.formatDate()
    };
    Cart.updateOne({item: req.body.productId, user: req.userData.userId}, item, {new: true})
        .then(result => {
            if(result.n <= 0) {
                let error = new ErrorResponseBuilder('Unable To Update The Item To Cart')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('CC-UCI-3')
                                        .build();
                return next(error);
            }
            let jsonResponse = new SuccessResponseBuilder('Item Updated Successfully!!!').build();
            return res.status(200).send(jsonResponse);
        })
        .catch(error => {
            logger.log(error, req, 'CC-UCI');
            let err = new ErrorResponseBuilder().errorCode('CC-UCI-4').status(500).errorType('UnknownError').build();
            return next(err);
        })
}

exports.deleteCartItem = (req, res, next) => {
    let reqValidity = validateRequest(req, 'productId');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('CC-DCI-1').build();
        return next(error);
    }
    Cart.updateOne({user: req.userData.userId, item: req.body.productId, activeStatus:'active'},{activeStatus: 'inactive', quantity: 0, activeDuration: dateUtility.formatDate()})
        .exec()
        .then(result => {
            if(result.n <= 0) {
                let error = new ErrorResponseBuilder('Unable To Delete The Item From Cart')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('CC-DCI-1')
                                        .build();
                return next(error);
            }
            let jsonResponse = new SuccessResponseBuilder('Item Successfully Deleted From Cart').build();
            return res.status(200).send(jsonResponse)
        })
        .catch(error => {
            logger.log(error, req, 'CC-DCI');
            let err = new ErrorResponseBuilder().errorCode('CC-DCI-2').status(500).errorType('UnknownError').build();
            return next(err);
        })
}
