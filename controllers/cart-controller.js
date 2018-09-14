const mongoose = require('mongoose');
const Cart = require('../models/cart-model');
const Inventory = require('../models/inventory-model');

exports.checkInventoryAvailability = (req, res, next) => {
    if(!req.userData) {
        return res.status(401).send('Unauthorized');
    }
    if(!req.body.productId || !mongoose.Types.ObjectId.isValid(req.body.productId)) {
        return res.status(401).send('ProductId passed in must be a single String of 12 bytes or a string of 24 hex characters');
    }
    Inventory.findOne({product: req.body.productId})
            .exec()
            .then(result => {
                if(!result || !result.product) {
                    return res.status(404).send('product not found in inventory')
                }
                req.body.stockLimit = result.availableQuantity;
                req.body.stockStatus = result.inventoryStatus;
                return next();
            })
            .catch(err => {
                return res.status(500).send('Unknown error occured')
            })
}


exports.addItem2Cart = (req, res, next) => {
    if(req.body.quantity > 25) {
        return res.status(400).send('You cannot add more than 25 products to at once.')
    }
    if(req.body.stockStatus === 'Inactive') {
        return res.status(301).send('The product is either inactive or running out of stock')
    }
    let bufferStock = req.body.stockLimit - req.body.quantity; 
    if(req.body.stockLimit < req.body.quantity) {
        return res.status(400).send(`There are only ${req.body.stockLimit} products left in stock and you cannot add more than that`)
    }
    
    const item = new Cart({
        item: req.body.productId,
        quantity: req.body.quantity,
        user: req.userData.userId,
        createdDate: new Date().toDateString(),
        activeStatus: 'active',
        activeDuration: new Date().toDateString()
    });
    item.save()
        .then(result => {
            Inventory.updateOne({product: req.body.productId},{availableQuantity: bufferStock})
                    .then(doc => {
                        return res.status(201).send(result);
                    })
                    .catch(err => {
                        return res.status(500).send('Something went wrong on updating inventory')
                    })
        })
        .catch(err => {
            return res.status(500).send('Something went wrong on adding to cart')
        })
}

exports.getActiveCart = (req, res, next) => {
    Cart.find({user: req.userData.userId, activeStatus: 'active'})
        .exec()
        .then(result => {
            return res.status(200).send(result)
        })
        .catch(err => {
            return res.status(500).send(err);
        })
}

exports.getCartHistory = (req, res, next) => {
    Cart.find({user: req.userData.userId})
        .exec()
        .then(result => {
            return res.status(200).send(result)
        })
        .catch(err => {
            return res.status(500).send(err)
        })
}

exports.updateCartItem = (req, res, next) => {
    let bufferStock = req.body.stockLimit - req.body.quantity; 
    if(req.body.stockLimit < req.body.quantity) {
        return res.status(400).send(`There are only ${req.body.stockLimit} products left in stock and you cannot add more than that`)
    }
    const updatedObj = {
        quantity: req.body.quantity,
        activeStatus: req.body.activeStatus
    };
    
    Cart.updateOne({user: req.userData.userId, item: req.body.productId}, updatedObj)
        .then(result => {
            Inventory.updateOne({item: req.body.productId},{availableQuantity: bufferStock})
                            .then(doc => {
                                return res.status(201).send(result);
                            })
                            .catch(err => {
                                return res.status(500).send('Something went wrong on updating inventory')
                            })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

exports.deleteCartItem = (req, res, next) => {
    Cart.deleteMany({user: req.userData.userId, item: req.body.productId})
        .then(result => {
            if(result.n > 0) {
                return res.status(200).send('Successfully deleted')
            }
            return res.status(404).send('Unable to delete')
        })
        .catch(err => {
            res.status(500).send('Something went wrong')
        })
}
