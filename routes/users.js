// routes to create users
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userConstroller');
const { check } = require('express-validator');

// create an user
// api/users
router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Provide a valid email').isEmail(),
        check('password', 'The password should have at least 6 characters').isLength({min: 6})
    ],  
    userController.createUser
);
module.exports = router;