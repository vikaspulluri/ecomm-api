const ResponseBuilder = require('../libraries/response-builder');
const Category = require('../models/category-model');

exports.checkCategoryExistence = function(options){
    return (req, res, next) => {
        if(!req.userData) {
            let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('CTC-CGE-1')
                                        .build();
            return res.status(401).send(jsonResponse);
        }
        if(!req.userData.isAdmin){
            let jsonResponse = new ResponseBuilder().error(true)
                                        .message('You need admin previleges to create/modify a category')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('CTC-CGE-2')
                                        .build();
            return res.status(401).send(jsonResponse);
        }
        if(!req.body.name) {
            let jsonResponse = new ResponseBuilder().error(true)
                                        .message('You Must specify a name for category')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CGE-3')
                                        .build();
            return res.status(400).send(jsonResponse);
        }
        let slugname;
        if(options === 'edit') {
            slugname = req.params.slugname;
        } else {
            slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
        }
        Category.countDocuments({slugname: slugname}).exec()
            .then(result => {
                if(result > 0 && options === 'create') {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('A category already exists with the given name. Use the existing one or create different one')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CGE-4')
                                        .build();
                    return res.status(400).send(jsonResponse);
                } if(result <= 0 && options === 'edit') {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('No Category present with the provided slugname')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CGE-5')
                                        .build();
                    return res.status(400).send(jsonResponse);
                }
                req.slugname = slugname;
                next();
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CTC-CGE-5')
                                        .build();
                return res.status(500).send(jsonResponse);
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
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Provided Parent Category Not Found')
                                        .status(401)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CPCV-1')
                                        .build();
                    return res.status(404).send(jsonResponse);
                })
                .catch(err => {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CTC-CPCV-2')
                                        .build();
                    return res.status(500).send(jsonResponse);
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
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Category Successfully Created!!!')
                                        .status(201)
                                        .data(data)
                                        .build();
                return res.status(201).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CTC-CC-1')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
}

exports.getCategories = (req, res, next) => {
    Category.find()
            .populate('parentCategory')
            .exec()
            .then(result =>{
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Successfully Fetched!!!')
                                        .status(200)
                                        .data(result)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CTC-GC-1')
                                        .build();
                res.status(500).send(jsonResponse);
            })
}

exports.editCategory = (req,res, next) => {
    let slugname = req.body.name.toString().toLowerCase().split(' ').join('-');
    const updatedObj = {name: req.body.name,
                        description: req.body.description,
                        slugname: slugname,
                        lastUpdated: new Date().toLocaleString(),
                        lastUpdatedBy: req.userData.userId
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
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Category Successfully Updated!!!')
                                        .status(200)
                                        .data(result)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CTC-EC-1')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
}

exports.deleteCategory = (req, res, next) => {
    if(!req.userData) {
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Authentication Failed')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('CTC-DC-1')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    if(!req.userData.isAdmin){
        let jsonResponse = new ResponseBuilder().error(true)
                                        .message('You Need Admin Previleges to create/modify a category')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('CTC-DC-2')
                                        .build();
        return res.status(401).send(jsonResponse);
    }
    Category.deleteOne({slugname: req.params.slugname})
            .then(result => {
                if(result.n <= 0) {
                    let jsonResponse = new ResponseBuilder().error(true)
                                        .message('Provided Category Not Found to Delete')
                                        .status(404)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-DC-3')
                                        .build();
                    return res.status(404).send(jsonResponse);
                }
                let jsonResponse = new ResponseBuilder().error(false)
                                        .message('Category Successfully Deleted!!!')
                                        .status(200)
                                        .build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let jsonResponse = new ResponseBuilder().error(true)
                                        .message('An Unknown Error Occured')
                                        .status(500)
                                        .errorType('UnknownError')
                                        .errorCode('CTC-DC-4')
                                        .build();
                return res.status(500).send(jsonResponse);
            })
}