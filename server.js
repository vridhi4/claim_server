require('dotenv').config();
const express = require('express');

//mongodb
require('./db');
const cors = require('cors');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const corsOptions = {

    origin:["http://localhost:3000", "https://claim-client-dun.vercel.app"],
    methods: "GET, POST, DELETE, PUT, PATCH",
    credentials: true

};
app.use(cors(corsOptions));

//swagger
// Swagger options
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'Your API Description',
      },
      servers: [
        {
          url: 'http://localhost:8003', // Adjust this URL based on your deployment environment
        },
      ],
    },
    // Path to the API routes
    apis: ['./api/*.js'], // Path to the file containing your route definitions
  };
  
  // Initialize swagger-jsdoc
  const swaggerSpec = swaggerJsdoc(options);
  
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  

//swagger


//middleware
app.use(express.json());

//router
const CustomerRouter = require('./api/customer');
app.use('/customer', CustomerRouter)

const AdminRouter = require('./api/admin');
app.use('/admin', AdminRouter)


//password handler
const bcrypt = require('bcrypt');


app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
});






