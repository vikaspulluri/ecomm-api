const express = require('express');
const router = express.Router();

const {decodeToken, checkUser, checkPrevilieges} = require('../middleware/check-auth');
const cartController = require('../controllers/cart-controller');

/**
 * @apiVersion 1.0.0
 * 
 * @api {post} /api/cart/add Add a product to Cart
 * @apiName addItem2Cart
 * @apiGroup Cart
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} product Product Id (Id generated while creating the product)
 * @apiParam {String} quantity Number of products to be added
 * 
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 201 Created
 *    {
 *      "error": false,
 *      "message": "Item Added To Cart Successfully!!!",
 *    }  
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 NOT AUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "IC-CPEIS-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "You Cannot Add More Than 25 Products To Cart At Once",
 *      "errorCode": "CC-AI2C-1",
 *      "errorType": "DataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "The Product is Either Inactive Or Running Out Of Stock",
 *      "errorCode": "CC-AI2C-2",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "There are only X products left in stock and you cannot add more than that",
 *      "errorCode": "CC-AI2C-3",
 *      "errorType": "DataValidationError"
 *    }
 * * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Unable To Add The Item To Cart",
 *      "errorCode": "CC-AI2C-4",
 *      "errorType": "UnknownError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Provided Category Not Found",
 *      "errorCode": "CC-AI2C-5",
 *      "errorType": "UnknownError"
 *    }
 */
router.post('/add', decodeToken,
                    checkUser,
                    cartController.checkInventoryAvailability,
                    cartController.checkIsProductActiveInCart,
                    cartController.addItem2Cart);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/cart/info Get Saved Cart
 * @apiName getSavedCart
 * @apiGroup Cart
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully retrieved the cart data!!!",
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
 *      "errorCode": "CC-GAC-1",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/info', decodeToken, checkUser, cartController.getActiveCart);

/**
 * @apiVersion 1.0.0
 * 
 * @api {get} /api/cart/history Get Cart History
 * @apiName getCartHistory
 * @apiGroup Cart
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Successfully retrieved the cart data!!!",
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
 *      "errorCode": "CC-GCH-1",
 *      "errorType": "UnknownError"
 *    }
 */
router.get('/history', decodeToken, checkUser, cartController.getCartHistory);


/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/cart/update Update a cart item
 * @apiName updateCartItem
 * @apiGroup Cart
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} product Product Id (Id generated while creating the product)
 * @apiParam {String} quantity Number of products to be added to cart
 * 
 * @apiSuccessExample {json} Success Response
 *    HTTP/1.1 200 OK
 *    {
 *      "error": false,
 *      "message": "Item Successfully Updated!!!",
 *    }
 * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 401 UNAUTHORIZED
 *    {
 *      "error": true,
 *      "message": "Authentication Failed",
 *      "errorCode": "IC-CPEIS-1",
 *      "errorType": "OAuthError"
 *    }
 * * @apiErrorExample {json} Error Response-1
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "You cannot add more than 25 products to cart at once.",
 *      "errorCode": "CC-UCI-1",
 *      "errorType": "dataValidationError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "There are only X products left in stock and you cannot add more than that",
 *      "errorCode": "CC-UCI-2",
 *      "errorType": "DataMissingError"
 *    }
 * * @apiErrorExample {json} Error Response-3
 *    HTTP/1.1 400 BAD REQUEST
 *    {
 *      "error": true,
 *      "message": "Unable to update the item",
 *      "errorCode": "CC-UCI-3",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "An Unknown Error Occured",
 *      "errorCode": "CC-UCI-4",
 *      "errorType": "UnknownError"
 *    }
 */
router.put('/update', decodeToken,
                    checkUser,
                    cartController.checkInventoryAvailability,
                    cartController.updateCartItem,);

/**
 * @apiVersion 1.0.0
 * 
 * @api {put} /api/cart/delete Delete an item from cart
 * @apiName deleteItemFromCart
 * @apiGroup Cart
 * 
 * @apiHeader {String} authorization Authorization Token prepended with (Bearer )
 * 
 * @apiParam {String} product Product Id (Id generated while creating the product)
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
 *      "errorCode": "CC-DCI-1",
 *      "errorType": "OAuthError"
 *    }
 * @apiErrorExample {json} Error Response-2
 *    HTTP/1.1 404 NOT FOUND
 *    {
 *      "error": true,
 *      "message": "Unable to delete the Item",
 *      "errorCode": "CC-DCI-2",
 *      "errorType": "DataMissingError"
 *    }
 * @apiErrorExample {json} Error Response-4
 *    HTTP/1.1 500 INTERNAL SERVER ERROR
 *    {
 *      "error": true,
 *      "message": "Something went wrong, please try again later...",
 *      "errorCode": "CC-DCI-3",
 *      "errorType": "UnknownError"
 *    }
 */
router.put('/delete', decodeToken, checkUser, cartController.deleteCartItem);

module.exports = router;