const express = require('express');
// All the express routes
const employeeRoutes = require('./Employee.route');
const authRoutes = require('./auth.route');
const apiRoute = express.Router();
// Routes Configuration
apiRoute.use('/employees', employeeRoutes);
apiRoute.use('/auth', authRoutes);
apiRoute.use('/', (req, res) => {
    res.send('Health Check Successful');
});

module.exports = apiRoute;