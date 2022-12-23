const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    // read header token
    const token = req.header('x-auth-token');
    //console.log(token);

    // check if there is a token
    if(!token){
        return res.status(401).json({msg: 'No token. Invalid permission'})
    }

    // validate token
    try {
        const encryption = jwt.verify(token, process.env.SECRET );
        req.user = encryption.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'});
    }
}