const express = require('express');
const bcrypt = require('bcrypt');
const {validateEmail , validatePassword} = require('./middleware.js');

const User = require('./model.js');

const router = express.Router();
const saltRound = 10;

const register = async (req , res) => {

    let existingUser = await User.findOne({email : req.body.email})
    .then(function(_user) {
        return true;
    })
    .catch(function(err) {
        console.log({"error in register findONe" : err});
        return false;
    })

    if(existingUser) {
        res.status(501).send({message : "user already exist"});
        return ;
    }
    
    let userObject = {
        userName : req.body.userName,
        email :req.body.email,
        password : bcrypt.hashSync(req.body.password , saltRound)
    }

    User(userObject).save()
    .then(function(_User) {
        res.status(200).send({message : _User});
        return ;
    })
    .catch(function(err) {
        console.log({"error in saving" : err});
    })
    
}

const login = async (req , res) => {

    let dataUser = await User.findOne({email : req.body.email})
    .then(function(existingUser) {
        return existingUser;
    })
    .catch(function(err) {
        console.log(err);
        return null;
    })

    let isValidUser = false;
    if(dataUser == null) {
        res.status(403).send({message : "User does not exist"})
        return ;
    } else {
        isValidUser = bcrypt.compareSync(req.body.password , dataUser.password);
    }

    if(isValidUser) {
        res.status(200).json({message : "login success"});
        return ;
    } else {
        res.status(403).json({message : "Wrong Password"});
        return ;
    }
}


router.post('/register' , validatePassword , validateEmail , register);
router.post('/login' , validatePassword , validateEmail , login);


module.exports = router;

