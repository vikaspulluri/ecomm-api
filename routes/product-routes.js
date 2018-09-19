const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product-controller');


/**
 * @apiVersion 1.0.0
 * 
 * @api {post} /api/product/create Create New Product
 * @apiName createProduct
 * @apiGroup Product
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} name Product Name
 * @apiParam {String} description Product Description
 * @apiParam {String} category Category Slugname
 * @apiParam {Object} price Product Price
 * @apiParam {String} price.originalPrice Original Price
 * @apiParam {String} [price.offerPrice] Offer Price
 * @apiParam {String} [price.currency] Currency
 * @apiParam {Object} [meta] Meta Info about product
 * @apiParam {String} meta.madeIn Product manufactured country
 * @apiParam {String} meta.color Product Color
 * @apiParam {String} meta.dimensions Product Dimensions
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 201 Created
 *    {
 *      "error": false,
 *      "message": "Successfully Created",
 *      "data": {
 *          "_id": "9jK8YXA5n",
 *          "name": "Adidas Casual Walking",
 *          "slugname": "adidas-casual-walking",
 *          "sku": 108,
 *          "description": "Adidas Casual Walking Sandals",
 *          "createdDate": "2018-09-18T17:08:55.000Z",
 *          "category": "5b99579666f6360394aee7d6",
 *          "createdBy": "5b96adc4744d4e1a38cf2a8a",
 *          "price": {
 *              "originalPrice" : 1500,
 *              "offerPrice": 1500,
 *              "currency": "INR"
 *           },
 *          "meta": {
 *              "color" : "black",
 *              "dimensions": "42 CM",
 *              "madeIn": "India"
 *           },
 *          "__v": 0
 *       }
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "You need admin previleges to create/modify a category",
 *      "errorCode": "PC-CP-2",
 *      "errorType": "OAuthError"
 *    }  
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "PC-CP-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "PC-GCI-2",
 *      "errorType": "UnknownError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Provided Category Not Found",
 *      "errorCode": "PC-GCI-1",
 *      "errorType": "dataValidationError"
 *    }
 */
router.post('/create', checkAuth, productController.getCategoryId, productController.createProduct);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/product/all Get All Products
 * @apiName getProducts
 * @apiGroup Product
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Fetched!!!",
 *      "data": [
 *          {
 *              "_id": "RuU2xqFVI",
 *              "name": "Motorola X4",
 *              "slugname": "motorola-x4",
 *              "description": "A powerful smartphone under mid range that features great specs",
 *              "sku": 104,
 *              "createdBy": "5b96adc4744d4e1a38cf2a8a",
 *              "__v": 0,
 *              "lastUpdated": "2018-09-18T17:39:33.590Z",
 *              "createdDate": "2018-09-18T17:08:55.000Z",
 *              "price": {
 *                  "originalPrice" : 22000,
 *                  "offerPrice": 22000,
 *                  "currency": "INR"
 *              },
 *              "meta": {
 *                  "color" : "black",
 *                  "dimensions": "5.2 inch",
 *                  "madeIn": "India"
 *              },
 *              "category": {
 *                  "_id" : "5b9959f60065320fecf91490",
 *                  "name": "Footwear",
 *                  "slugname": "footwear",
 *                  "description": "General Footwear",
 *                  "creator": "5b96adc4744d4e1a38cf2a8a",
 *                  "createdDate": "2018-09-18T17:08:55.000Z",
 *                  "lastUpdated": "2018-09-18T17:08:55.000Z",
 *                  "__v": 0
 *              }
 *          }
 *      ]
 *    } 
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "PC-GP-1",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/all', productController.getProducts);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/product/:ID Get Product by ID
 * @apiName getProduct
 * @apiGroup Product
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Fetched!!!",
 *      "data": {
 *              "_id": "RuU2xqFVI",
 *              "name": "Motorola X4",
 *              "slugname": "motorola-x4",
 *              "description": "A powerful smartphone under mid range that features great specs",
 *              "sku": 104,
 *              "createdBy": "5b96adc4744d4e1a38cf2a8a",
 *              "__v": 0,
 *              "lastUpdated": "2018-09-18T17:39:33.590Z",
 *              "createdDate": "2018-09-18T17:08:55.000Z",
 *              "price": {
 *                  "originalPrice" : 22000,
 *                  "offerPrice": 22000,
 *                  "currency": "INR"
 *              },
 *              "meta": {
 *                  "color" : "black",
 *                  "dimensions": "5.2 inch",
 *                  "madeIn": "India"
 *              },
 *              "category": {
 *                  "_id" : "5b9959f60065320fecf91490",
 *                  "name": "Footwear",
 *                  "slugname": "footwear",
 *                  "description": "General Footwear",
 *                  "creator": "5b96adc4744d4e1a38cf2a8a",
 *                  "createdDate": "2018-09-18T17:08:55.000Z",
 *                  "lastUpdated": "2018-09-18T17:08:55.000Z",
 *                  "__v": 0
 *              }
 *          }
 *    } 
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Product Not Found",
 *      "errorCode": "PC-GPBI-1",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "PC-GPBI-2",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/:id', productController.getProductById);

/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/product/edit/:id Edit a product by its ID
 * @apiName editProduct
 * @apiGroup Product
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} name Product Name
 * @apiParam {String} description Product Description
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Updated!!!",
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
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "PC-CPE-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need admin previleges to create/modify a category",
 *      "errorCode": "PC-CPE-2",
 *      "errorType": "OAuthError"
 *    }
 * * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "A Valid Id Must Be Supplied To Edit A Product",
 *      "errorCode": "PC-CPE-3",
 *      "errorType": "dataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "No Product Found With The Requested Id",
 *      "errorCode": "PC-CPE-4",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-5
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Provided Category Not Found",
 *      "errorCode": "PC-GCI-1",
 *      "errorType": "dataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-6
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "PC-CPE-5",
 *      "errorType": "UnknownError"
 *    }
 *  @apiErrorExample {json} Error Response-6
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Update Failed",
 *      "errorCode": "PC-UP-3",
 *      "errorType": "UnknownError"
 *    }
 */
router.put('/edit/:id', checkAuth, productController.checkProductExistence, productController.getCategoryId, productController.updateProduct);

/**
 * @apiVersion 1.0.0
 * 
 * @api {delete} /api/product/delete/:id Delete a Product
 * @apiName deleteProduct
 * @apiGroup Product
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Deleted!!!",
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "PC-CPE-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need admin previleges to create/modify a category",
 *      "errorCode": "PC-CPE-2",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "No Product Found With The Requested Id",
 *      "errorCode": "PC-CPE-4",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "An Unknown Error Occured",
 *      "errorCode": "PC-DP-3",
 *      "errorType": "UnknownError"
 *    }
 */
router.delete('/delete/:id', checkAuth, productController.checkProductExistence, productController.deleteProduct);


module.exports = router;