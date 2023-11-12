const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require("./api/routes/auth")
const inventoryRegRoute = require("./api/routes/inventoryRegistration")

mongoose.connect('mongodb+srv://root:root@merndb1.9y9lbnb.mongodb.net/?retryWrites=true&w=majority');

const allowedOrigins = ["http://localhost:8080", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/inventory',inventoryRegRoute);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404; // Fix: Set the status property to 404
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500); // Fix: Use error.status or default to 500
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
