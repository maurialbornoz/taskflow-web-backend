const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
// const { use } = require('../routes/users');

exports.authenticateUser = async ( req, res ) => {
            
    // check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    // extract email and password
    const {email, password} = req.body;
    if(!email || !password){
        return null;
    }
    try {
        // check for registered user
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'User does not exist'});
        }

        // check password with password of db
        const correctPassword = await bcryptjs.compare(password, user.password);
        if(!correctPassword){
            return res.status(400).json({msg: 'Incorrect password'});
        }

        // if everything is correct create and sign JWT
        const payload = {
            user : {
                id: user.id
            }
        };

        // sign JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hour
        }, (error, token) => {
            if(error) throw error;
        
            // confirmation message 
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
    }
}

// get which user is authenticated
exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
       
        console.log(error);
        res.status(500).json({msg: 'Error'});
    }
}