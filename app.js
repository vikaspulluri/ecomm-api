const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();
mongoose.connect('mongodb+srv://vikas:' + process.env.MONGO_ATLAS_PW +'@cluster0-ppqhq.mongodb.net/e-comm?retryWrites=true')
        .then(() => {
          console.log('successfully connected to mongodb!!!');
        })
        .catch(() => {
          console.log('connection to mongodb failed!!!');
        });

//routes
const userRoutes = require('./routes/user-routes');

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



module.exports = app;
