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


module.exports = {validateEmail , validatePassword};