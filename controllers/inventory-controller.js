// We will update inventory once cart item moved to checkout phase which is out of scope for this project
const Inventory = require('../models/inventory-model');
const ResponseBuilder = require('../libraries/response-builder');

exports.checkProductExistenceInStock = function(options){
    return (req, res, next) => {
        if(!req.userData) {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('Unauthorized Access')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('IC-CPEIS-1')
                                        .build();
            return res.status(401).send(jsonResponse);
        }
        if(!req.userData.isAdmin) {
            let jsonResponse = ResponseBuilder.error(true)
                                        .message('You need Admin previliges to perform this operation')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('IC-CPEIS-2')
                                        .build();
            return res.status(401).send(jsonResponse);
        }
        let productId;
        productId = options === 'add' ? req.body.product : req.params.id;
        Inventory.countDocuments({product: productId})
                .exec()
                .then(result => {
                    if(result > 0 && options === 'add') {
                        let jsonResponse = ResponseBuilder.error(true)
                                        .message('Product Already Exists In Inventory. Update It Instead Of Adding Again!!!')
                                        .status(400)
                                        .errorType('dataExistanceError')
                                        .errorCode('IC-CPEIS-3')
                                        .build();
                        return res.status(400).send(jsonResponse);
                    }
                    if(result <= 0 && options === 'update') {
                        let jsonResponse = ResponseBuilder.error(true)
                                        .message('Product Does Not Exist In Inventory. Add It Before Updating It')
                                        .status(404)
                                        .errorType('dataMissingError')
                                        .errorCode('IC-CPEIS-4')
                                        .build();
                        return res.status(400).send(jsonResponse);
                    }
                    return next();
                })
                .catch(err => {
                    let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('IC-CPEIS-5')
                                        .build();
                    return res.status(500).send(jsonResponse);
                })
    }
}

exports.addItemToInventory = (req, res, next) => {
    const data = {
        product: req.body.productId,
        availableStock: req.body.availableStock,
        inventoryStatus: req.body.inventoryStatus,
        creator: req.userData.userId,
        createdDate: new Date().toLocaleString()
    }

    const inventory = new Inventory(data);
    inventory.save()
            .then(result => {
                let jsonResponse = ResponseBuilder.error(false)
                                        .message('Item Successfully Added To Inventory')
                                        .status(201)
                                        .data(result)
                                        .build();
                return res.status(201).send(jsonResponse)
            })
            .catch(error => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownErrorOccured')
                                        .errorCode('IC-AITI-1')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
}

exports.updateInventoryById = (req, res, next) => {
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
                if(result.n > 0) {
                    let jsonResponse = ResponseBuilder.error(false)
                                        .message('Successfully Updated!!!')
                                        .status(200)
                                        .build();
                    return res.status(200).send(jsonResponse);
                }
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Unable to Update the Inventory')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('IC-UIBI-1')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('IC-UIBI-2')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
}

exports.deleteInventoryById = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = ResponseBuilder.error(true)
                                    .message('Unauthorized Access')
                                    .status(401)
                                    .errorType('OAuthError')
                                    .errorCode('IC-DIBI-1')
                                    .build();
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin) {
        let jsonResponse = ResponseBuilder.error(true)
                                    .message('You need Admin previliges to perform this operation')
                                    .status(401)
                                    .errorType('OAuthError')
                                    .errorCode('IC-DIBI-2')
                                    .build();
        return res.status(401).send(jsonResponse);
    }
    Inventory.deleteOne({product: req.params.id})
            .exec()
            .then(result => {
                if(result.n <= 0) {
                    let jsonResponse = ResponseBuilder.error(true)
                                        .message('No Stock Found With Provided Id')
                                        .status(404)
                                        .errorType('DataMissingError')
                                        .errorCode('IC-DIBI-4')
                                        .build();
                    return res.status(404).send(jsonResponse);    
                }
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Successfully Deleted')
                                        .status(200)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('IC-DIBI-5')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}

exports.getAllInventory = (req, res, next) => {
    Inventory.find()
            .populate(['product'])
            .exec()
            .then(result => {
                let jsonResponse = ResponseBuilder.error(false)
                                        .message('Successfully Fetched!!!')
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
                                        .errorCode('IC-GAI-1')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}

exports.getInventoryById = (req, res, next) => {
    Inventory.findOne({product: req.params.id})
            .exec()
            .then(result => {
                if(!result) {
                    let jsonResponse = ResponseBuilder.error(true)
                                        .message('No Inventory Stock Found with The Provided Id')
                                        .status(404)
                                        .errorType('DataMissingError')
                                        .errorCode('IC-GIBI-1')
                                        .build();
                    return res.status(404).send(jsonResponse)
                }
                let jsonResponse = ResponseBuilder.error(false)
                                        .message('Successfully Fetched')
                                        .status(200)
                                        .data(result)
                                        .build();
                return res.status('200').send(jsonResponse)
            })
            .catch(err => {
                let jsonResponse = ResponseBuilder.error(true)
                                        .message('Something went wrong, please try again later...')
                                        .status(500)
                                        .errorType('UnknwonError')
                                        .errorCode('IC-GIBI-2')
                                        .build();
                return res.status(500).send(jsonResponse)
            })
}
