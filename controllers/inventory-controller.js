// We will update inventory once cart item moved to checkout phase which is out of scope for this project
const Inventory = require('../models/inventory-model');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const validateRequest = require('../libraries/validate-request');
const dateUtility = require('../libraries/date-formatter');


exports.checkProductExistenceInStock = function(options){
    return (req, res, next) => {
        let reqValidity = validateRequest(req, 'name');
        if(reqValidity.includes(false)) {
            let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('IC-CPEIS-1').build();
            return next(error);
        }
        let productId;
        productId = options === 'add' ? req.body.product : req.params.id;
        Inventory.countDocuments({product: productId})
                .exec()
                .then(result => {
                    if(result > 0 && options === 'add') {
                        let error = new ErrorResponseBuilder('Product Already Exists In Inventory. Update It Instead Of Adding Again!!!')
                                        .status(400)
                                        .errorType('dataExistanceError')
                                        .errorCode('IC-CPEIS-1')
                                        .build();
                        return next(error);
                    }
                    if(result <= 0 && options === 'update') {
                        let error = new ErrorResponseBuilder('Product Does Not Exist In Inventory. Add It Before Updating It')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('IC-CPEIS-2')
                                        .build();
                        return next(error);
                    }
                    return next();
                })
                .catch(error => {
                    let err = new ErrorResponseBuilder().errorCode('IC-CPEIS-3').build();
                    return next(err);
                })
    }
}

exports.addItemToInventory = (req, res, next) => {
    let reqValidity = validateRequest(req, 'productId','availableStock', 'inventoryStatus');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request')
                                        .errorType('DataValidationError')
                                        .status(400)
                                        .errorCode('IC-AITI-1')
                                        .build();
        return next(error);
    }
    const data = {
        product: req.body.productId,
        availableStock: req.body.availableStock,
        inventoryStatus: req.body.inventoryStatus,
        creator: req.userData.userId,
        createdDate: dateUtility.formatDate()
    }

    const inventory = new Inventory(data);
    inventory.save()
            .then(result => {
                let jsonResponse = new SuccessResponseBuilder('Item Successfully Added To Inventory').status(201).data(result).build();
                return res.status(201).send(jsonResponse)
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('IC-AITI-2').build();
                return next(err);
            })
}

exports.updateInventoryById = (req, res, next) => {
    let reqValidity = validateRequest(req, 'availableStock', 'inventoryStatus');
    if(reqValidity.includes(false)) {
        let error = new ErrorResponseBuilder('Invalid request')
                                        .errorType('DataValidationError')
                                        .status(400)
                                        .errorCode('IC-UIBI-1')
                                        .build();
        return next(error);
    }
    const updatedObj = {
        product: req.params.id,
        availableStock: req.body.availableStock,
        inventoryStatus: req.body.inventoryStatus,
        lastModifiedOn: new Date().toLocaleString(),
        lastModifiedBy: req.userData.userId
    };
    Inventory.updateOne({product: req.params.id},updatedObj,{new: true})
            .exec()
            .then(result => {
                if(result.n <= 0) {
                    let error = new ErrorResponseBuilder('Unable to Update the Inventory')
                                        .status(404)
                                        .errorType('ProductNotFoundError')
                                        .errorCode('IC-UIBI-2')
                                        .build();
                    return next(error);
                }
                let jsonResponse = new SuccessResponseBuilder('Successfully Updated!!!').build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('IC-UIBI-3').build();
                return next(err);
            })
}

exports.deleteInventoryById = (req, res, next) => {
    Inventory.deleteOne({product: req.params.id})
            .exec()
            .then(result => {
                if(result.n <= 0) {
                    let error = new ErrorResponseBuilder('No Stock Found With Provided Id')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('IC-DIBI-1')
                                        .build();
                    return next(error);    
                }
                let jsonResponse = new SuccessResponseBuilder('Successfully Deleted').build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('IC-DIBI-2').build();
                return next(err);
            })
}

exports.getAllInventory = (req, res, next) => {
    Inventory.find()
            .populate(['product'])
            .exec()
            .then(result => {
                let jsonResponse = new SuccessResponseBuilder('Successfully Fetched!!!').data(result).build();
                return res.status(200).send(jsonResponse)
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('IC-GAI-2').build();
                return next(err);
            })
}

exports.getInventoryById = (req, res, next) => {
    Inventory.findOne({product: req.params.id})
            .exec()
            .then(result => {
                if(!result) {
                    let error = new ErrorResponseBuilder('No Inventory Stock Found with The Provided Id')
                                        .status(404)
                                        .errorType('ItemNotFoundError')
                                        .errorCode('IC-GIBI-1')
                                        .build();
                    return next(error);
                }
                let jsonResponse = new SuccessResponseBuilder('Successfully Fetched').data(result).build();
                return res.status('200').send(jsonResponse)
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('IC-GIBI-2').build();
                return next(err);
            })
}
