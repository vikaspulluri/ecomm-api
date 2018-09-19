define({ "api": [
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/api/category/create",
    "title": "Create New Category",
    "name": "createCategory",
    "group": "Category",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Category Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Category Description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "parentCategory",
            "description": "<p>Slugname of Parent Category</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 201 Created\n{\n  \"error\": false,\n  \"message\": \"Category Successfully Created!!!\",\n  \"data\": {\n      \"id\": \"5ba13128da289a0b3c953e5b\",\n      \"name\": \"Computers\",\n      \"slugname\": \"computers\",\n      \"description\": \"Electronic Gadgets\",\n      \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n      \"parentCategory\": {\n          \"id\" : \"5b9959f60065320fecf91490\"\n       }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"CTC-CGE-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"CA-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"A category already exists with the given name. Use the existing one or create different one\",\n  \"errorCode\": \"CTC-CGE-3\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-4",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"Provided Parent Category Not Found\",\n  \"errorCode\": \"CTC-CPCV-1\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/category-routes.js",
    "groupTitle": "Category"
  },
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/category/delete/:slugname",
    "title": "Delete a category",
    "name": "deleteCategory",
    "group": "Category",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Category Successfully Deleted!!!\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"CTC-DC-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"CTC-DC-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"Provided Category Not Found to Delete\",\n  \"errorCode\": \"CTC-DC-3\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-4",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"An Unknown Error Occured\",\n  \"errorCode\": \"CTC-DC-4\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/category-routes.js",
    "groupTitle": "Category"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/api/category/edit/:slugname",
    "title": "Edit a category by its slugname",
    "name": "editCategory",
    "group": "Category",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Category Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Category Description</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Category Successfully Updated!!!\",\n  \"data\": [\n      {\n          \"_id\": \"5ba288a659b4752764414f52\",\n          \"name\": \"Laptop\",\n          \"slugname\": \"laptop\",\n          \"description\": \"Electronic Gadgets\",\n          \"creator\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"__v\": 0,\n          \"lastUpdated\": \"2018-09-18T17:39:33.590Z\",\n          \"lastUpdatedBy\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n          \"parentCategory\": \"5b9959f60065320fecf91490\"\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"You Must specify a name for category\",\n  \"errorCode\": \"CTC-CGE-3\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"No Category present with the provided slugname\",\n  \"errorCode\": \"CTC-CGE-5\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"CTC-CGE-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-4",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"CTC-CGE-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-5",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"Provided Parent Category Not Found\",\n  \"errorCode\": \"CTC-CPCV-1\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/category-routes.js",
    "groupTitle": "Category"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/category/all",
    "title": "Get All Categories",
    "name": "getCategories",
    "group": "Category",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Successfully Fetched!!!\",\n  \"data\": [\n      {\n          \"_id\": \"5ba13128da289a0b3c953e5b\",\n          \"name\": \"Slippers\",\n          \"slugname\": \"computers\",\n          \"description\": \"Electronic Gadgets\",\n          \"creator\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"__v\": 0,\n          \"lastUpdated\": \"2018-09-18T17:39:33.590Z\",\n          \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n          \"parentCategory\": {\n              \"_id\" : \"5b9959f60065320fecf91490\",\n              \"name\": \"Footwear\",\n              \"slugname\": \"footwear\",\n              \"description\": \"General Footwear\",\n              \"creator\": \"5b96adc4744d4e1a38cf2a8a\",\n              \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n              \"__v\": 0\n          }\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"CTC-CGE-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"CA-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/category-routes.js",
    "groupTitle": "Category"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "F__Workspace_Edwisor_courses_Latest_Courses_e_commerce_api_doc_main_js",
    "groupTitle": "F__Workspace_Edwisor_courses_Latest_Courses_e_commerce_api_doc_main_js",
    "name": ""
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./docs/main.js",
    "group": "F__Workspace_Edwisor_courses_Latest_Courses_e_commerce_api_docs_main_js",
    "groupTitle": "F__Workspace_Edwisor_courses_Latest_Courses_e_commerce_api_docs_main_js",
    "name": ""
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/api/product/create",
    "title": "Create New Product",
    "name": "createProduct",
    "group": "Product",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Product Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Product Description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>Category Slugname</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "price",
            "description": "<p>Product Price</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "price.originalPrice",
            "description": "<p>Original Price</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "price.offerPrice",
            "description": "<p>Offer Price</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "price.currency",
            "description": "<p>Currency</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "meta",
            "description": "<p>Meta Info about product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "meta.madeIn",
            "description": "<p>Product manufactured country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "meta.color",
            "description": "<p>Product Color</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "meta.dimensions",
            "description": "<p>Product Dimensions</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 201 Created\n{\n  \"error\": false,\n  \"message\": \"Successfully Created\",\n  \"data\": {\n      \"_id\": \"9jK8YXA5n\",\n      \"name\": \"Adidas Casual Walking\",\n      \"slugname\": \"adidas-casual-walking\",\n      \"sku\": 108,\n      \"description\": \"Adidas Casual Walking Sandals\",\n      \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n      \"category\": \"5b99579666f6360394aee7d6\",\n      \"createdBy\": \"5b96adc4744d4e1a38cf2a8a\",\n      \"price\": {\n          \"originalPrice\" : 1500,\n          \"offerPrice\": 1500,\n          \"currency\": \"INR\"\n       },\n      \"meta\": {\n          \"color\" : \"black\",\n          \"dimensions\": \"42 CM\",\n          \"madeIn\": \"India\"\n       },\n      \"__v\": 0\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"PC-CP-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"PC-CP-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"Something went wrong, please try again later...\",\n  \"errorCode\": \"PC-GCI-2\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-4",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"Provided Category Not Found\",\n  \"errorCode\": \"PC-GCI-1\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/product-routes.js",
    "groupTitle": "Product"
  },
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/product/delete/:id",
    "title": "Delete a Product",
    "name": "deleteProduct",
    "group": "Product",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Successfully Deleted!!!\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"PC-CPE-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"PC-CPE-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"No Product Found With The Requested Id\",\n  \"errorCode\": \"PC-CPE-4\",\n  \"errorType\": \"DataMissingError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-4",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"An Unknown Error Occured\",\n  \"errorCode\": \"PC-DP-3\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/product-routes.js",
    "groupTitle": "Product"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/api/product/edit/:id",
    "title": "Edit a product by its ID",
    "name": "editProduct",
    "group": "Product",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Product Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Product Description</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Successfully Updated!!!\",\n  \"data\": [\n      {\n          \"_id\": \"5ba288a659b4752764414f52\",\n          \"name\": \"Laptop\",\n          \"slugname\": \"laptop\",\n          \"description\": \"Electronic Gadgets\",\n          \"creator\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"__v\": 0,\n          \"lastUpdated\": \"2018-09-18T17:39:33.590Z\",\n          \"lastUpdatedBy\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n          \"parentCategory\": \"5b9959f60065320fecf91490\"\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"PC-CPE-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"You need admin previleges to create/modify a category\",\n  \"errorCode\": \"PC-CPE-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"A Valid Id Must Be Supplied To Edit A Product\",\n  \"errorCode\": \"PC-CPE-3\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-4",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"No Product Found With The Requested Id\",\n  \"errorCode\": \"PC-CPE-4\",\n  \"errorType\": \"DataMissingError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-5",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"Provided Category Not Found\",\n  \"errorCode\": \"PC-GCI-1\",\n  \"errorType\": \"dataValidationError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-6",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"Something went wrong, please try again later...\",\n  \"errorCode\": \"PC-CPE-5\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-6",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"Update Failed\",\n  \"errorCode\": \"PC-UP-3\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/product-routes.js",
    "groupTitle": "Product"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/product/:ID",
    "title": "Get Product by ID",
    "name": "getProduct",
    "group": "Product",
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Successfully Fetched!!!\",\n  \"data\": {\n          \"_id\": \"RuU2xqFVI\",\n          \"name\": \"Motorola X4\",\n          \"slugname\": \"motorola-x4\",\n          \"description\": \"A powerful smartphone under mid range that features great specs\",\n          \"sku\": 104,\n          \"createdBy\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"__v\": 0,\n          \"lastUpdated\": \"2018-09-18T17:39:33.590Z\",\n          \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n          \"price\": {\n              \"originalPrice\" : 22000,\n              \"offerPrice\": 22000,\n              \"currency\": \"INR\"\n          },\n          \"meta\": {\n              \"color\" : \"black\",\n              \"dimensions\": \"5.2 inch\",\n              \"madeIn\": \"India\"\n          },\n          \"category\": {\n              \"_id\" : \"5b9959f60065320fecf91490\",\n              \"name\": \"Footwear\",\n              \"slugname\": \"footwear\",\n              \"description\": \"General Footwear\",\n              \"creator\": \"5b96adc4744d4e1a38cf2a8a\",\n              \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n              \"lastUpdated\": \"2018-09-18T17:08:55.000Z\",\n              \"__v\": 0\n          }\n      }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 404 NOT FOUND\n{\n  \"error\": true,\n  \"message\": \"Product Not Found\",\n  \"errorCode\": \"PC-GPBI-1\",\n  \"errorType\": \"DataMissingError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"Something went wrong, please try again later...\",\n  \"errorCode\": \"PC-GPBI-2\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/product-routes.js",
    "groupTitle": "Product"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/product/all",
    "title": "Get All Products",
    "name": "getProducts",
    "group": "Product",
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"Successfully Fetched!!!\",\n  \"data\": [\n      {\n          \"_id\": \"RuU2xqFVI\",\n          \"name\": \"Motorola X4\",\n          \"slugname\": \"motorola-x4\",\n          \"description\": \"A powerful smartphone under mid range that features great specs\",\n          \"sku\": 104,\n          \"createdBy\": \"5b96adc4744d4e1a38cf2a8a\",\n          \"__v\": 0,\n          \"lastUpdated\": \"2018-09-18T17:39:33.590Z\",\n          \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n          \"price\": {\n              \"originalPrice\" : 22000,\n              \"offerPrice\": 22000,\n              \"currency\": \"INR\"\n          },\n          \"meta\": {\n              \"color\" : \"black\",\n              \"dimensions\": \"5.2 inch\",\n              \"madeIn\": \"India\"\n          },\n          \"category\": {\n              \"_id\" : \"5b9959f60065320fecf91490\",\n              \"name\": \"Footwear\",\n              \"slugname\": \"footwear\",\n              \"description\": \"General Footwear\",\n              \"creator\": \"5b96adc4744d4e1a38cf2a8a\",\n              \"createdDate\": \"2018-09-18T17:08:55.000Z\",\n              \"lastUpdated\": \"2018-09-18T17:08:55.000Z\",\n              \"__v\": 0\n          }\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"Something went wrong, please try again later...\",\n  \"errorCode\": \"PC-GP-1\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/product-routes.js",
    "groupTitle": "Product"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/api/user/create",
    "title": "Create New User",
    "name": "CreateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>First Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last Name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "Number[]",
            "optional": true,
            "field": "phone",
            "description": "<p>Phone Numbers</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "street",
            "description": "<p>Street</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "city",
            "description": "<p>City</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "state",
            "description": "<p>State</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "country",
            "description": "<p>Country</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "pin",
            "description": "<p>Pincode</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "isadmin",
            "description": "<p>Create an account with admin previleges</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 201 OK\n{\n  \"error\": false,\n  \"message\": \"User created successfully!!!\",\n  \"data\": {\n      \"userId\": \"5b9ff8f4558ca01054196469\",\n      \"firstName\": \"Vikas\",\n      \"lastName\": \"Pulluri\",\n      \"email\": \"vikasiiitn@gmail.com\",\n      \"phone\": [\n          9494336401\n       ],\n      \"address\": {\n          \"street\": \"Rajeev street\",\n          \"city\": \"Chintalapudi\",\n          \"state\": \"Andhra Pradesh\",\n          \"country\": \"India\",\n          \"pin\": 534460\n      }\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 400 BAD REQUEST\n{\n  \"error\": true,\n  \"message\": \"An account already exists with the provided email Id\",\n  \"errorCode\": \"UV-1\",\n  \"errorType\": \"duplicateDataError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"Something went wrong, please try again later...\",\n  \"errorCode\": \"UC-CU-2\",\n  \"errorType\": \"UnknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user-routes.js",
    "groupTitle": "User"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/user/@self",
    "title": "Get User",
    "name": "GetUser",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization Token prepended with (Bearer )</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"User Data Fetched Successfully!!!\",\n  \"data\": {\n      \"userId\": \"5b9ff8f4558ca01054196469\",\n      \"firstName\": \"Vikas\",\n      \"lastName\": \"Pulluri\",\n      \"email\": \"vikasiiitn@gmail.com\",\n      \"createdOn\": \"2018-09-10T18:28:32.000Z\",\n      \"orders\": [],\n      \"phone\": [\n          9494336401\n       ],\n      \"address\": {\n          \"street\": \"Rajeev street\",\n          \"city\": \"Chintalapudi\",\n          \"state\": \"Andhra Pradesh\",\n          \"country\": \"India\",\n          \"pin\": 534460\n      }\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Authentication Failed\",\n  \"errorCode\": \"CA-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user-routes.js",
    "groupTitle": "User"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/api/user/login",
    "title": "Login User",
    "name": "LoginUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": false,\n  \"message\": \"User Logged In Successfully...\",\n  \"data\": {\n      \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpa2FzaWlpdG5AZ21haWwuY29tIiwiaWQiOiI1Yjk2YWRjNDc0NGQ0ZTFhMzhjZjJhOGEiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1MzcyMTMwNjQsImV4cCI6MTUzNzIxNjY2NH0.2U_A27fPZPgkqN1DaS9fg_C6qr5AUeU7rRsO6yQk1uQ\",\n      \"username\": \"Vikas Pulluri\",\n      \"email\": \"vikasiiitn@gmail.com\",\n      \"expiryDuration\": 3600,\n      \"userId\": \"5b96adc4744d4e1a38cf2a8a\"\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response-1",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Invalid username provided\",\n  \"errorCode\": \"UC-LU-1\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-2",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n  \"error\": true,\n  \"message\": \"Invalid Authentication Credentials\",\n  \"errorCode\": \"UC-LU-2\",\n  \"errorType\": \"OAuthError\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response-3",
          "content": "HTTP/1.1 500 INTERNAL SERVER ERROR\n{\n  \"error\": true,\n  \"message\": \"Something went wrong, please try again later...\",\n  \"errorCode\": \"UC-LU-3\",\n  \"errorType\": \"UknownError\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user-routes.js",
    "groupTitle": "User"
  }
] });
