const jwt = require('jsonwebtoken');

const validatePassword = (req , res , next) => {
    const user = req.body;
    let pass = user.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/);

    if(!pass) {
        res.status(401).json({ meassge : "password is weak"});
    } else if(user.confirmPassword != undefined && user.password != user.confirmPassword)
    {
        res.status(401).json({ meassge : "password not match"});
    } else {
    next();
    }
    return ;
}

const validateEmail = (req , res , next) => {
    const email = req.body.email;
    if(email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    {
        next();
    }
    else {
        res.status(401).json({ meassge : "Wrong email address"});
    }
    return ;
}

const validateToken = (req , res , next) => {

    try {
        let cookies = req.headers.cookie;
        // console.log(cookies);
        if(cookies == undefined)
        {
            res.status(500).send({Message : "cookie expired"});
            return ;
        }
        let token = cookies.split('=')[1];
        jwt.verify(token , process.env.JWT_SECRET_KEY , (err , decode) => {
            if(!err) {
                req.user = decode.user_Id;
                next();
            } 
        })
    } catch (error) {
        console.log({"error in token and cookies" : error.message})
        res.status(500).send({Message : error.message});
    }
    
}


module.exports = {validateEmail , validatePassword , validateToken};