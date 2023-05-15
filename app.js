require('dotenv').config(); 
require('express-async-errors')   // async errors


const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

//requires the error handlers 
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

// middleware
app.use(express.json());

// route
app.get('', (req, res) => {
    res.send('<h1>Store API</h1><a href="api/v1/products">Products routes</a>')
});
app.use('/api/v1/products', productsRouter)
// products route


// Uses the error handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// sets the port using the .env file
const port = process.env.PORT || 1000;

//set up the async start function & db connection
const start = async () => {
    try {
      //connectDB
      await connectDB(process.env.MONGO_URI)
      app.listen(port, console.log(`The service port is ${port}...`));
    } catch (error) {
       console.log(error)
    }
};
start();