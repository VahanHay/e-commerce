const ApiError = require('./../erorr/ApiEror.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Basket} = require('./../models/models.js');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
};

class UserController {
    async registration(req, res)  {
       const {email, password, role} = req.body;
       
      

        if(!email || !password){
            return next(ApiError.bedRequest('Email Or Password must Be'))
        }
        const condidate = await User.findOne({where:{email}});

        if(condidate){
            return next(ApiError.bedRequest('Email are exist'))
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, role, password: hashPassword});
        const basket = await Basket.create({userId: user.id});

        const token = generateJwt(user.id, user.password,user.role)

    return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body;

        const user = await User.findOne({where:{email}});

        if(!user){
           next(ApiError.bedRequest('eamil false'))
        }
        let comparePassword = bcrypt.compareSync(password , user.password);
        if(!comparePassword){
            next(ApiError.bedRequest('Password false'))
        }
        const token = generateJwt(user.id, user.password,user.role)

       return res.json({token})
 
    }
 
    async check(req, res, next) {
        const token =  generateJwt(req.user.id, req.user.email, req.user.id);
          return res.json({token})
    }
}

module.exports =new UserController();