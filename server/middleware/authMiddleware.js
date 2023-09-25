const jwt = require('jsonwebtoken')

module.exports = function(req,res, next) {
    if(req.method === "OPTIONS") {
        next()
    }

    try{

        const token = req.headers.authorization.split(' ')[1] // type token
        if(!token){
            return res.status(401).json({message:"You are not registrate"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next()
    }catch(e){
        res.status(401).json({message:"You are not registrate"});
    }
}