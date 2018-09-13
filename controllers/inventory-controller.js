const Inventory = require('../models/inventory-model');

exports.checkProductExistenceInStock = function(options){
    return (req, res, next) => {
        Inventory.countDocuments({productId: req.body.productId})
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
        product: req.body.product,
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

exports.addItemsToInventory = (req, res, next) => {

}

exports.updateInventoryById = (req, res, next) => {

}

exports.deleteInventoryById = (req, res, next) => {
    const id = req.params.id;
    Inventory.deleteOne({_id: id})
            .exec()
            .then(result => {
                return res.status(200).send(result);
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.getAllInventory = (req, res, next) => {
    Inventory.find()
            .populate(['product','creator'])
            .exec()
            .then(result => {
                return res.status(200).send(result)
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.getInventoryById = (req, res, next) => {

}

exports.getInventoryByIds = (req, res, next) => {

}