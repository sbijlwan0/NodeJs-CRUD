const express = require('express');
const jwt = require('../config/jwt.config');
const authRoute = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Employee module which is required and imported
let employeeModel = require('../Model/Employee');

authRoute.route('/login').post(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const employee = await employeeModel.findOne({
        email
    });
    if (employee) {
        try {
            bcrypt.compare(password, employee.password, (err, result) => {
                if (err) {
                    res.status(400).send("Something Went Wrong");
                } else if (result) {
                    res.status(200).json({
                        token: jwt.gentToken({
                            email,
                            password
                        }),
                        msg: 'Login Successfully'
                    });
                } else {
                    res.status(403).json({
                        'msg': 'Incorrect Password'
                    });
                }
            });
        } catch (err) {
            next('User Not Found!')
        }
    } else {
        res.status(403).json({
            'msg': 'User Not Found'
        });
    }
});

authRoute.route('/validate').get(jwt.checkToken, async (req, res) => {
    const email = req.user.email;
    const employee = await employeeModel.findOne({
        email
    }).select({
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    });
    res.status(200).json({
        msg: 'User Validated',
        data: employee
    });
});

module.exports = authRoute;