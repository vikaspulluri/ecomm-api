const express = require('express');
const router = express.Router();

const {decodeToken, checkUser, checkPrevilieges} = require('../middleware/check-auth');
const categoryController = require('../controllers/category-controller');

/**
 * @apiVersion 1.0.0 
 * 
 * @api {post} /api/category/create Create New Category
 * @apiName createCategory
 * @apiGroup Category
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} name Category Name
 * @apiParam {String} description Category Description
 * @apiParam {String} [parentCategory] Slugname of Parent Category
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 201 Created
 *    {
 *      "error": false,
 *      "message": "Category Successfully Created!!!",
 *      "data": {
 *          "id": "5ba13128da289a0b3c953e5b",
 *          "name": "Computers",
 *          "slugname": "computers",
 *          "description": "Electronic Gadgets",
 *          "createdDate": "2018-09-18T17:08:55.000Z",
 *          "parentCategory": {
 *              "id" : "5b9959f60065320fecf91490"
 *           }
 *       }
 *    }
 * * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Invalid Request",
 *      "errorCode": "CTC-CGE-1",
 *      "errorType": "DataValidationError"
 *    } 
 * * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 NOT AUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 401 NOT AUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need admin previleges to perform this operation",
 *      "errorCode": "Ca-2",
 *      "errorType": "OAuthError"
 *    }  
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "A category already exists with the given name. Use the existing one or create different one",
 *      "errorCode": "CTC-CGE-2",
 *      "errorType": "DataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Provided Parent Category Not Found",
 *      "errorCode": "CTC-CPCV-1",
 *      "errorType": "DataValidationError"
 *    }
 */
router.post('/create', decodeToken, checkUser, checkPrevilieges, categoryController.checkCategoryExistence('create'), categoryController.checkParentCategoryValidity('create'), categoryController.createCategory);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/category/all Get All Categories
 * @apiName getCategories
 * @apiGroup Category
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Fetched!!!",
 *      "data": [
 *          {
 *              "_id": "5ba13128da289a0b3c953e5b",
 *              "name": "Slippers",
 *              "slugname": "computers",
 *              "description": "Electronic Gadgets",
 *              "creator": "5b96adc4744d4e1a38cf2a8a",
 *              "__v": 0,
 *              "lastUpdated": "2018-09-18T17:39:33.590Z",
 *              "createdDate": "2018-09-18T17:08:55.000Z",
 *              "parentCategory": {
 *                  "_id" : "5b9959f60065320fecf91490",
 *                  "name": "Footwear",
 *                  "slugname": "footwear",
 *                  "description": "General Footwear",
 *                  "creator": "5b96adc4744d4e1a38cf2a8a",
 *                  "createdDate": "2018-09-18T17:08:55.000Z",
 *                  "__v": 0
 *              }
 *          }
 *      ]
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CTC-GC-1",
 *      "errorType": "OAuthError"
 *    }  
 */
router.get('/all', categoryController.getCategories);

/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/category/edit/:slugname Edit a category by its slugname
 * @apiName editCategory
 * @apiGroup Category
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} name Category Name
 * @apiParam {String} description Category Description
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Category Successfully Updated!!!",
 *      "data": [
 *          {
 *              "_id": "5ba288a659b4752764414f52",
 *              "name": "Laptop",
 *              "slugname": "laptop",
 *              "description": "Electronic Gadgets",
 *              "creator": "5b96adc4744d4e1a38cf2a8a",
 *              "__v": 0,
 *              "lastUpdated": "2018-09-18T17:39:33.590Z",
 *              "lastUpdatedBy": "5b96adc4744d4e1a38cf2a8a",
 *              "createdDate": "2018-09-18T17:08:55.000Z",
 *              "parentCategory": "5b9959f60065320fecf91490"
 *          }
 *      ]
 *    }
 *  * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need admin previleges to perform this operation",
 *      "errorCode": "CA-2",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Invalid Request",
 *      "errorCode": "CTC-CCE-1",
 *      "errorType": "DataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "No Category present with the provided slugname",
 *      "errorCode": "CTC-CCE-3",
 *      "errorType": "ItemNotFoundError"
 *    }
 * @apiErrorExample {json} Error Response-5
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Provided Parent Category Not Found",
 *      "errorCode": "CTC-CPCV-1",
 *      "errorType": "ItemNotFoundError"
 *    }
 */
router.put('/edit/:slugname', decodeToken, checkUser, checkPrevilieges, categoryController.checkCategoryExistence('edit'), categoryController.checkParentCategoryValidity('edit'), categoryController.editCategory);

/**
 * @apiVersion 1.0.0
 * 
 * @api {delete} /api/category/delete/:slugname Delete a category
 * @apiName deleteCategory
 * @apiGroup Category
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Category Successfully Deleted!!!",
 *    }
 * 
 *  * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "CA-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need admin previleges to perform this operation",
 *      "errorCode": "CA-2",
 *      "errorType": "OAuthError"
 *    }  
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Provided Category Not Found to Delete",
 *      "errorCode": "CTC-DC-1",
 *      "errorType": "ItemNotFoundError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CTC-DC-4",
 *      "errorType": "UnknownError"
 *    }
 */
router.delete('/delete/:slugname', decodeToken, checkUser, checkPrevilieges, categoryController.deleteCategory);


module.exports = router;