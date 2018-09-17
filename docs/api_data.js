define({ "api": [
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
