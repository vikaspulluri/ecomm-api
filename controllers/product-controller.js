const Product = require('../models/product-model');
const Category = require('../models/category-model');
const responseObj = require('../libraries/response');

exports.createSKU = (req, res, next) => {
    Product.countDocuments()
            .exec()
            .then(result => {
                let count = result + 1;
                req.body.sku = 'PS' + count;
                return next();
            })
            .catch(err => {
                res.status(500).send('Something went wrong')
            })
}

exports.getCategoryId = (req, res, next) => {
    Category.findOne({slugname: req.body.category})
            .exec()
            .then(result => {
                if(result && result._id) {
                    req.categoryId = result._id;
                    return next();
                }
                let jsonResponse = responseObj.respondError(true, 'Provided category not found', 404, 'dataValidationError');
                return res.status(404).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = responseObj.respondError(true, 'Unknown error', 500, 'dataValidationError');
                return res.status(500).send(jsonResponse);
            })
}

exports.getProducts = (req, res, next) => {
    Product.find()
            .populate('category')
            .exec()
            .then(result => {
                let response = result || [];
                return res.status(200).send(response);
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.addProduct = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = responseObj.respondError(true, 'You need admin previleges to create/modify a product', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    const slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
    const body = {
        name: req.body.name,
        description: req.body.description,
        sku: req.body.sku,
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
                return res.status(201).send(result);
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.getProductById = (req, res, next) => {
    Product.findById(req.params.id)
            .populate('category')
            .exec()
            .then(result => {
                return res.status(200).send(result)
            })
            .catch(err => {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    name: err.name
                })
            })
}

exports.checkProductExistence = (req, res, next) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).send('A valid id must be supplied to edit a product')
    }
    Product.countDocuments({_id: req.params.id})
            .exec()
            .then(result => {
                if(result <= 0) {
                    return res.status(404).send('No product found with the requested id')
                }
                next();
            })
            .catch(err => {
                res.status(500).send(err);
            })
}

exports.updateProduct = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = responseObj.respondError(true, 'You need admin previleges to create/modify a category', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
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
    Product.findByIdAndUpdate({_id: req.params.id}, body, {new: true})
            .populate('category')
            .exec()
            .then(result => {
                return res.status(200).send(result);
            })
            .catch(err => {
                return res.status(500).send(err)
            })
}

exports.deleteProduct = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = responseObj.respondError(true, 'You need admin previleges to create/modify a category', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    Product.deleteOne({_id: req.params.id})
            .then(result => {
                return res.status(200).send('Successfully deleted');
            })
            .catch(err => {
                return res.status(500).send('Unable to delete the product')
            })
}