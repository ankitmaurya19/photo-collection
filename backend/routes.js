const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const upload = multer({dest : 'uploads'});

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

const fileUpload = async (req , res) => {
    
    let email = req.headers.auth
    // let email = req.query.auth;
    const newImage = {
        name : req.file.originalname,
        data : req.file.path,
        description : req.body.desc,
        date : Date()
    }
    await User.findOne({email})
    .then((_user) => {
        _user.photos.push(newImage);
        _user.save();
    })
    .catch((err) => {
        console.log(err);
    })

    res.send("file recieved");
}

const viewImages = async (req , res) => {

    // let user = req.headers.auth;
    let user = req.query.auth;
    let images = await User.findOne({email : user})
    .then((_user) => {
        return _user.photos;
    })
    .catch((err) => {
        console.log(err);
    })
    
    let resFile = [];
    for(let i in images)
    {
        let image = {
            name : images[i].name,
            desc : images[i].desc,
            id : images[i]._id,
            img : images[i].data.toString()
        }
        resFile.push(image);
        
    }
    res.send(resFile);
}


router.post('/register' , validatePassword , validateEmail , register);
router.post('/login' , validatePassword , validateEmail , login);
router.post('/upload-image' , upload.single('image') , fileUpload);
router.get('/view-images' , viewImages);

module.exports = router;

