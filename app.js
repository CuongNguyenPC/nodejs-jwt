const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')

mongoose.connect('mongodb://127.0.0.1:27017/nodeshop',{ useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
//easier way to post image
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//CORS
/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Menthods','PUT POST  PATCH  DELETE')
        return res.status(200).json({});
    }

});*/

//routes should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
    const error =  new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
            error:{
                message: error.message
            }
    });
});

module.exports = app;