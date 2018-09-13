const responseObj = require('../libraries/response');
const Category = require('../models/category-model');

exports.checkCategoryExistence = function(options){
    return (req, res, next) => {
        if(!req.userData) {
            let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
            return res.status(401).send(jsonResponse);
        }
        if(!req.userData.isAdmin){
            let jsonResponse = responseObj.respondError(true, 'You need admin previleges to create/modify a category', 401, 'OAuthError');
            return res.status(401).send(jsonResponse);
        }
        let slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
        if(options === 'edit') {
            slugname = req.params.slugname;
        }
        Category.countDocuments({slugname: slugname}).exec()
            .then(result => {
                if(result > 0 && options === 'create') {
                    let jsonResponse = responseObj.respondError(true, 'A category already exists with the given name. Use the existing one or create different one', 401, 'dataValidationError');
                    return res.status(401).send(jsonResponse);
                } if(result <= 0 && options === 'edit') {
                    let jsonResponse = responseObj.respondError(true, 'No Category present with the provided slugname', 401, 'dataValidationError');
                    return res.status(401).send(jsonResponse);
                }
                req.slugname = slugname;
                next();
            })
            .catch(err => {
                let jsonResponse = responseObj.respondError(true, 'An error occured during checking the document', 500, 'OAuthError');
                return res.status(401).send(jsonResponse);
            })
    }
}

exports.checkParentCategoryValidity = function(options){
    return (req, res, next) => {
        if(!req.body.parentCategory) {
            req.parentCategory = false;
            return next();
        }
        let slugname = req.body.parentCategory.toString().toLowerCase().split(' ').join('-');
        Category.findOne({slugname: slugname})
                .exec()
                .then(document => {
                    if(document && document._id) {
                        req.parentCategory = document._id;
                        return next();
                    }
                    let jsonResponse = responseObj.respondError(true, 'Parent category not found', 500, 'OAuthError');
                    return res.status(401).send(jsonResponse);
                })
                .catch(err => {
                    let jsonResponse = responseObj.respondError(true, 'An error occured during checking the document', 500, 'OAuthError');
                    return res.status(401).send(jsonResponse);
                })
    }
}
exports.createCategory = (req, res, next) => {
    let categoryObj = {
        name: req.body.name,
        description: req.body.description,
        creator: req.userData.userId,
        createdDate: new Date().toLocaleString(),
        slugname: req.slugname
    };
    if(req.parentCategory) {
        categoryObj.parentCategory = req.parentCategory;
    }
    const category = new Category(categoryObj);
    category.save()
            .then(result => {
                const data = {
                    id: result._id,
                    name: result.name,
                    description: result.description,
                    slugname: result.slugname,
                    createdDate: result.createdDate,
                }
                if(result.parentCategory) {
                    data.parentCategory = {
                        id: result.parentCategory
                    }
                }
                let jsonResponse = responseObj.respondOk(false, 'Category successfully created!!!', 201, data);
                return res.status(201).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = responseObj.respondError(true, 'An error occured during creating the category', 500, 'OAuthError');
                return res.status(500).send(jsonResponse);
            })
}

exports.getCategories = (req, res, next) => {
    Category.find()
            .populate('parentCategory')
            .exec()
            .then(result => res.status(200).send(result))
            .catch(error => res.status(500).send('unknown error'))
}

exports.editCategory = (req,res, next) => {
    let slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
    const updatedObj = {name: req.body.name,
                        description: req.body.description,
                        slugname: slugname,
                        lastUpdated: new Date().toLocaleString(),
                        lastUpdated: req.userData.userId
                    };
    if(req.parentCategory) {
        updatedObj.parentCategory = req.parentCategory;
    }
    Category.findOneAndUpdate(
                {slugname: req.slugname},
                updatedObj,
                {new: true}
            )
            .then(result => {
                return res.status(200).send(result);
            })
            .catch(err => {
                return res.status(500).send(err);
            })
}

exports.deleteCategory = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = responseObj.respondError(true, 'Authentication failed', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = responseObj.respondError(true, 'You need admin previleges to create/modify a category', 401, 'OAuthError');
        return res.status(401).send(jsonResponse);
    }
    Category.deleteOne({slugname: req.params.slugname})
            .then(result => {
                if(result.n <= 0) {
                    return res.status(404).send('Category not found');
                }
                return res.status(200).send('Successfully deleted');
            })
            .catch(err => {
                return res.status(500).send('Unable to delete the category')
            })
}