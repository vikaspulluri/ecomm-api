const express = require('express');
const router = express.Router();

const {decodeToken, checkUser, checkPrevilieges} = require('../middleware/check-auth');
const inventoryController = require('../controllers/inventory-controller');
const validateIdParam = require('../middleware/validate-id-param');

/**
 * @apiVersion 1.0.0
 * 
 * @api {post} /api/inventory/add Add a product to Inventory
 * @apiName addProduct
 * @apiGroup Inventory
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} product Product Id (Id generated while creating the product)
 * @apiParam {String} availableStock Stock availability for the product
 * @apiParam {String} [inventoryStatus] Inventory Status (active or inactive)
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 201 Created
 *    {
 *      "error": false,
 *      "message": "Successfully Added to Inventory",
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
 *    HTTP/1.1 401 NOT AUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need Admin previliges to perform this operation",
 *      "errorCode": "IC-CPEIS-2",
 *      "errorType": "OAuthError"
 *    }  
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 NOT AUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "IC-CPEIS-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Product Already Exists In Inventory. Update It Instead Of Adding Again!!!",
 *      "errorCode": "IC-CPEIS-3",
 *      "errorType": "dataExistanceError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Provided Category Not Found",
 *      "errorCode": "IC-CPEIS-5",
 *      "errorType": "UnknownError"
 *    }
 */
router.post('/add', decodeToken,
                    checkUser,
                    checkPrevilieges,
                    inventoryController.checkProductExistenceInStock('add'),
                    inventoryController.addItemToInventory);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/inventory/all Get All Inventory
 * @apiName getInventory
 * @apiGroup Inventory
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
 *      "errorCode": "IC-GAI-1",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/all', inventoryController.getAllInventory);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/inventory/:productId Get Inventory Details By Product Id
 * @apiName getInventoryByProductId
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
 *      "message": "No Inventory Stock Found with The Provided Id",
 *      "errorCode": "IC-GIBI-1",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "IC-GIBI-2",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/:id', validateIdParam, inventoryController.getInventoryById);

/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/product/edit/:id Edit a product by its ID
 * @apiName editInventoryItem
 * @apiGroup Inventory
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} product Product Id (Id generated while creating the product)
 * @apiParam {String} availableStock Stock availability for the product
 * @apiParam {String} [inventoryStatus] Inventory Status (active or inactive)
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully Updated!!!",
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "IC-CPEIS-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need Admin previliges to perform this operation",
 *      "errorCode": "IC-CPEIS-2",
 *      "errorType": "OAuthError"
 *    }
 * * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Invalid Id Provided",
 *      "errorCode": "VIP-1",
 *      "errorType": "dataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Product Does Not Exist In Inventory. Add It Before Updating It",
 *      "errorCode": "IC-CPEIS-4",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-5
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Unable to Update the Inventory",
 *      "errorCode": "IC-UIBI-1",
 *      "errorType": "UnknownError"
 *    }
 * @apiErrorExample {json} Error Response-6
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "An Unknown Error Occured",
 *      "errorCode": "IC-UIBI-2",
 *      "errorType": "UnknownError"
 *    }
 */
router.put('/edit/:id', decodeToken, checkUser, checkPrevilieges,
                        validateIdParam,
                        inventoryController.checkProductExistenceInStock('update'),
                        inventoryController.updateInventoryById);

/**
 * @apiVersion 1.0.0
 * 
 * @api {delete} /api/inventory/delete/:id Delete a Product from Inventory
 * @apiName deleteProductFromInventory
 * @apiGroup Inventory
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
 *      "errorCode": "IC-DIBI-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "You need Admin previliges to perform this operation",
 *      "errorCode": "IC-DIBI-2",
 *      "errorType": "OAuthError"
 *    }
 * * * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Invalid Id Provided",
 *      "errorCode": "VIP-1",
 *      "errorType": "dataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "No Stock Found With Provided Id",
 *      "errorCode": "IC-DIBI-4",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "An Unknown Error Occured",
 *      "errorCode": "IC-DIBI-5",
 *      "errorType": "UnknownError"
 *    }
 */
router.delete('/delete/:id', decodeToken, checkUser, checkPrevilieges, validateIdParam, inventoryController.deleteInventoryById);



module.exports = router;