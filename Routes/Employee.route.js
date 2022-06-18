// Importing important packages
const express = require('express');

const employeeRoute = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Employee module which is required and imported
let employeeModel = require('../Model/Employee');
const {
    exists
} = require('../Model/Employee');

// To Get List Of Employees
employeeRoute.route('/').get(function (req, res) {
    employeeModel.find((err, employee) => {
        if (err) {
            console.log(err);
        } else {
            res.json(employee);
        }
    }).select({
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    });
});

// To Add New Employee
employeeRoute.route('/addEmployee').post(async (req, res) => {
    let employee = new employeeModel(req.body);
    employee.password = await bcrypt.hash(employee.password, saltRounds);
    let emp = await employeeModel.findOne({
        email: employee.email
    });
    if (!emp) {
        employee.save()
            .then((emp) => {
                res.status(200).json({
                    message: 'Employee Added Successfully',
                });
            })
            .catch(err => {
                res.status(400).json({
                    msg: err.errmsg
                });
            });
    } else {
        res.status(400).json({
            msg: ' Email already exists.'
        });
    }
});

// To Get Employee Details By Employee ID
employeeRoute.route('/getEmployee/:id').get(function (req, res) {
    let id = req.params.id;
    employeeModel.findById(id, function (err, employee) {
        res.json(employee);
    }).select({
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
    });
});

// To Update The Employee Details
employeeRoute.route('/updateEmployee/:id').post(function (req, res, next) {
    employeeModel.findById(req.params.id, function (err, employee) {
        try {
            employee.firstName = req.body.firstName;
            employee.lastName = req.body.lastName;
            employee.email = req.body.email;
            employee.phone = req.body.phone;

            employee.save().then(emp => {
                    res.json('Employee Updated Successfully');
                })
                .catch(err => {
                    res.status(400).send("Unable To Update Employee");
                });
        } catch (err) {
            next('User Not Found!');
        }
    });
});

// To Delete The Employee
employeeRoute.route('/deleteEmployee/:id').get(function (req, res) {
    employeeModel.findByIdAndRemove({
        _id: req.params.id
    }, function (err, employee) {
        if (err) res.json(err);
        else res.json('Employee Deleted Successfully');
    });
});

module.exports = employeeRoute;