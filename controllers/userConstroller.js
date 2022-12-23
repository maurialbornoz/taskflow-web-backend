const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    
    
    // check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    // extract email and password
    const {email, password } = req.body;

    try {

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({msg: 'Email is already registered'});
        }

        // create new user
        user = new User(req.body);

        // password hashing
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // save new user
        await user.save();

        // create and sign JWT
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
        res.status(400).send('There wan an error');
    }
}