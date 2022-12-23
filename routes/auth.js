// routes to authenticate users
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
// login
// api/auth
router.post('/',

    authController.authenticateUser
);
// get authenticated user
router.get('/',
    auth,
    authController.authenticatedUser
);
module.exports = router;