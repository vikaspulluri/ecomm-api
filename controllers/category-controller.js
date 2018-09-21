const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const Category = require('../models/category-model');


exports.checkCategoryExistence = function(options){
    return (req, res, next) => {
        //TODO: validate request
        if(!req.body.name) {
            let error = new ErrorResponseBuilder('You Must specify a name for category')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CGE-1')
                                        .build();
            return next(error);
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
                    let error = new ErrorResponseBuilder('A category already exists with the given name. Use the existing one or create different one')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CGE-2')
                                        .build();
                    return next(error);
                } if(result <= 0 && options === 'edit') {
                    let error = new ErrorResponseBuilder('No Category present with the provided slugname')
                                        .status(400)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CGE-3')
                                        .build();
                    return next(error);
                }
                req.slugname = slugname;
                next();
            })
            .catch(error=> {
                let err = new ErrorResponseBuilder().errorCode('CTC-CGE-4').build();
                return next(err);
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
                    let error = new ErrorResponseBuilder('Provided Parent Category Not Found')
                                        .status(401)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-CPCV-1')
                                        .build();
                    return next(error);
                })
                .catch(err => {
                    let err = new ErrorResponseBuilder().errorCode('CTC-CPCV-2').build();
                    return next(err);
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
                let jsonResponse = new SuccessResponseBuilder('Category Successfully Created!!!').status(201).data(data).build();
                return res.status(201).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('CTC-CC-1').build();
                return next(err);
            })
}

exports.getCategories = (req, res, next) => {
    Category.find()
            .populate('parentCategory')
            .exec()
            .then(result =>{
                let jsonResponse = new SuccessResponseBuilder('Successfully Fetched!!!').status(200).data(result).build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('CTC-GC-1').build();
                return next(err);
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
                let jsonResponse = new SuccessResponseBuilder('Category Successfully Updated!!!').status(200).data(result).build();
                return res.status(200).send(jsonResponse);
            })
            .catch(err => {
                let err = new ErrorResponseBuilder().errorCode('CTC-EC-1').build();
                return next(err);
            })
}

exports.deleteCategory = (req, res, next) => {
    Category.deleteOne({slugname: req.params.slugname})
            .then(result => {
                if(result.n <= 0) {
                    let error = new ErrorResponseBuilder('Provided Category Not Found to Delete')
                                        .status(404)
                                        .errorType('dataValidationError')
                                        .errorCode('CTC-DC-1')
                                        .build();
                    return res.status(404).send(error);
                }
                let jsonResponse = new SuccessResponseBuilder('Category Successfully Deleted!!!').status(200).build();
                return res.status(200).send(jsonResponse);
            })
            .catch(error => {
                let err = new ErrorResponseBuilder().errorCode('CTC-DC-2').build();
                return next(err);
            })
}