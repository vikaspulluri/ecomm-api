const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const autoIncrement = require('mongoose-auto-increment');

const app = express();
mongoose.connect('mongodb+srv://vikas:' + process.env.MONGO_ATLAS_PW +'@cluster0-ppqhq.mongodb.net/e-comm?retryWrites=true', { autoIndex: false, useNewUrlParser: true })
        .then(() => {
          console.log('successfully connected to mongodb!!!');
        })
        .catch((err) => {
          console.log('connection to mongodb failed!!!');
        });
autoIncrement.initialize(mongoose.connection);



//routes
const userRoutes = require('./routes/user-routes');
const categoryRoutes = require('./routes/category-routes');
const productRoutes = require('./routes/product-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const cartRoutes = require('./routes/cart-routes');

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cart', cartRoutes);

module.exports = app;
