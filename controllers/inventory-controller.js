const mongoose = require('mongoose');
const Inventory = require('../models/inventory-model');

exports.checkProductExistenceInStock = function(options){
    return (req, res, next) => {
        if(!req.userData) {
            return res.status(401).send('Unauthorized');
        }
        if(!req.userData.isAdmin) {
            return res.status(401).send('Admin access is required to do this operation');
        }
        Inventory.countDocuments({product: req.body.productId})
                .exec()
                .then(result => {
                    if(result > 0 && options === 'add') {
                        return res.status(400).send('product already exists in inventory. Update it instead of adding again')
                    }
                    if(result <= 0 && options === 'update') {
                        return res.status(400).send('product does not exist in inventory. Add it before updating it');
                    }
                    return next();
                })
                .catch(err => {
                    return res.status(500).send(err);
                })
    }
}

exports.addItemToInventory = (req, res, next) => {
    const data = {
        product: req.body.productId,
        availableQuantity: req.body.availableQuantity,
        inventoryStatus: req.body.inventoryStatus,
        creator: req.userData.userId,
        createdDate: new Date().toLocaleString()
    }

    const inventory = new Inventory(data);
    inventory.save()
            .then(result => {
                return res.status(201).send(result)
            })
            .catch(error => {
                return res.status(500).send(error)
            })
}

exports.updateInventoryById = (req, res, next) => {
    const updatedObj = {
        product: req.body.productId,
        availableQuantity: req.body.availableQuantity,
        inventoryStatus: req.body.inventoryStatus,
        lastModifiedOn: new Date().toLocaleString(),
        lastModifiedBy: req.userData.userId
    };
    Inventory.updateOne({product: req.body.productId},updatedObj,{new: true})
            .exec()
            .then(result => {
                if(result.n > 0) {
                    return res.status(201).send('Successfully updated');
                }
                return res.status(500).send('Update failed')
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.deleteInventoryById = (req, res, next) => {
    Inventory.deleteOne({_id: req.params.id})
            .exec()
            .then(result => {
                if(result.n <= 0) {
                    return res.status(404).send('No stock found with provided id');    
                }
                return res.status(200).send('Successfully deleted');
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.getAllInventory = (req, res, next) => {
    Inventory.find()
            .populate(['product'])
            .exec()
            .then(result => {
                return res.status(200).send(result)
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.getInventoryById = (req, res, next) => {
    Inventory.findById({_id: req.params.id})
            .exec()
            .then(result => {
                if(!result) {
                    return res.status(404).send('No stock found with provided id')
                }
                return res.status('200').send(result)
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}
