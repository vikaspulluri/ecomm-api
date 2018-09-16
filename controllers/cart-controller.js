const Cart = require('../models/cart-model');
const Inventory = require('../models/inventory-model');
const shortId = require('shortid');
const ResponseBuilder = require('../libraries/response-builder');

exports.checkInventoryAvailability = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = ResponseBuilder.error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('CC-CIA-1')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    if(!req.body.productId || !shortId.isValid(req.body.productId)) {
        let jsonResponse = ResponseBuilder.error(true)
                                        .message('Valid Product Id Should Be Supplied')
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-CIA-2')
                                        .build();
        return res.status(400).send(jsonResponse);
    }
    Inventory.findOne({product: req.body.productId})
            .exec()
            .then(result => {
                if(!result || !result.product) {
                    let jsonResponse = ResponseBuilder.error(true)
                                        .message('Product Not Found In The Inventory')
                                        .status(404)
                                        .errorType('DataMissingError')
                                        .errorCode('CC-CIA-3')
                                        .build();
                    return res.status(404).send(jsonResponse)
                }
                req.body.stockLimit = result.availableStock;
                req.body.stockStatus = result.inventoryStatus;
                return next();
            })
            .catch(err => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something Went Wrong, Please Try Again Later!!!')
                                        .status(500)
                                        .errorType('UnkownError')
                                        .errorCode('CC-CIA-4')
                                        .build();
                return res.status(500).send(jsonResponse)
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
    if(req.body.quantity > 25) {
        let jsonResponse = ResponseBuilder.error(true)
                                        .message('You Cannot Add More Than 25 Products To Cart At Once')
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-AI2C-1')
                                        .build();
        return res.status(400).send(jsonResponse)
    }
    if(req.body.stockStatus === 'inactive') {
        let jsonResponse = ResponseBuilder.error(true)
                                        .message('The Product is Either Inactive Or Running Out Of Stock')
                                        .status(301)
                                        .errorType('DataMissingError')
                                        .errorCode('CC-AI2C-2')
                                        .build();
        return res.status(301).send(jsonResponse)
    }
    if(req.body.stockLimit < req.body.quantity) {
        let message = `There are only ${req.body.stockLimit} products left in stock and you cannot add more than that`;
        let jsonResponse = ResponseBuilder.error(true)
                                        .message(message)
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-AI2C-3')
                                        .build();
        return res.status(400).send(jsonResponse)
    }
    
    const item = {
        item: req.body.productId,
        quantity: req.body.quantity,
        user: req.userData.userId,
        activeStatus: 'active',
        activeDuration: new Date().toDateString()
    };
    if(req.isProductActiveInCart && req.isProductActiveInCart === true) {
        Cart.updateOne({item: req.body.productId, user: req.userData.userId}, item, {new: true})
            .then(result => {
                if(result.n <= 0) {
                    let jsonResponse = ResponseBuilder.error(true)
                                        .message('Unable To Add The Item To Cart')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-AI2C-4')
                                        .build();
                    return res.status(500).send(jsonResponse);
                }
                let jsonResponse = ResponseBuilder.error(false)
                                        .message('Item Added To Cart Successfully!!!')
                                        .status(200)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-AI2C-5')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
    } else {
        item.createdDate = new Date().toDateString();
        const cart = new Cart(item);
        cart.save()
            .then(result => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Item Successfully Added To Cart!!!')
                                        .status(200)
                                        .build();
                return res.status(200).send(jsonResponse)
            })
            .catch(err => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-AI2C-6')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
    }
    
}

exports.getActiveCart = (req, res, next) => {
    Cart.find({user: req.userData.userId, activeStatus: 'active'})
        .exec()
        .then(result => {
            let jsonResponse = ResponseBuilder.error(false)
                                        .message('Successfully retrieved the data')
                                        .status(200)
                                        .data(result)
                                        .build();
            return res.status(200).send(jsonResponse)
        })
        .catch(err => {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-GAC-5')
                                        .build();
            return res.status(500).send(jsonResponse);
        })
}

exports.getCartHistory = (req, res, next) => {
    Cart.find({user: req.userData.userId, activeStatus: 'inactive'})
        .exec()
        .then(result => {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('Successfully retrieved the cart')
                                        .status(200)
                                        .data(result)
                                        .build();
            return res.status(200).send(result)
        })
        .catch(err => {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-GCH-1')
                                        .build();
            return res.status(500).send(jsonResponse)
        })
}

exports.updateCartItem = (req, res, next) => {
    if(req.body.quantity > 25) {
        let jsonResponse = ResponseBuilder.error(true)
                                        .message('You cannot add more than 25 products to cart at once.')
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-UCI-1')
                                        .build();
        return res.status(400).send(jsonResponse);
    }
    
    if(req.body.stockLimit < req.body.quantity) {
        let message = `There are only ${req.body.stockLimit} products left in stock and you cannot add more than that`;
        let jsonResponse = ResponseBuilder.error(true)
                                        .message(message)
                                        .status(400)
                                        .errorType('DataValidationError')
                                        .errorCode('CC-UCI-2')
                                        .build();
        return res.status(400).send(jsonResponse)
    }
    
    const item = {
        item: req.body.productId,
        quantity: req.body.quantity,
        activeDuration: new Date().toDateString()
    };
    Cart.updateOne({item: req.body.productId, user: req.userData.userId}, item, {new: true})
        .then(result => {
            let jsonResponse = ResponseBuilder.error(false)
                                        .message('Item Successfully Updated')
                                        .status(200)
                                        .build();
            return res.status(200).send(jsonResponse);
        })
        .catch(err => {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-UCI-3')
                                        .build();
            return res.status(500).send(jsonResponse);
        })
}

exports.deleteCartItem = (req, res, next) => {
    Cart.updateOne({user: req.userData.userId, item: req.body.productId},{activeStatus: 'inactive', quantity: 0, activeDuration: new Date().toDateString()})
        .exec()
        .then(result => {
            if(result.n > 0) {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Unable to delete the Item')
                                        .status(404)
                                        .errorType('DataMissingError')
                                        .errorCode('CC-DCI-1')
                                        .build();
                return res.status(404).send(jsonResponse)
            }
            let jsonResponse = ResponseBuilder.error(false)
                                        .message('Item Successfully Deleted From Cart')
                                        .status(200)
                                        .build();
            return res.status(200).send(jsonResponse)
        })
        .catch(err => {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CC-DCI-2')
                                        .build();
            res.status(500).send(jsonResponse)
        })
}
