const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const upload = multer({dest : 'uploads'});
const jwt = require('jsonwebtoken');

const {validateEmail , validatePassword , validateToken} = require('./middleware.js');

const User = require('./model.js');
const { json } = require('body-parser');

const router = express.Router();
const saltRound = 10;
const cookieExpirationTime = 3600 * 1000;

const register = async (req , res) => {

    try {

        let existingUser = await User.findOne({email : req.body.email})

        if(existingUser) {
            res.status(501).send({message : "user already exist"});
            return ;
        }
        
        let userObject = {
            userName : req.body.userName,
            email :req.body.email,
            password : bcrypt.hashSync(req.body.password , saltRound)
        }

        let registeredUser = await User(userObject).save().then(_user => _user);
        let userID = {
            user_Id : registeredUser.email
        }
        let token = jwt.sign(userID , process.env.JWT_SECRET_KEY , {expiresIn : '3000s'});
        
        res.cookie("jwt" , token , {
            expires : new Date(Date.now() + cookieExpirationTime),
            httpOnly : true,
            // secure : true // for https
        })
        res.status(201).render('home');

    } catch (error) {
        
        console.log({"Error while registering the user" : error.message});

    }

    
}

const login = async (req , res) => {

    try {

        let dataUser = await User.findOne({email : req.body.email})
 
        let isValidUser = false;
        if(dataUser == null) {
            res.status(403).send({message : "User does not exist"})
            return ;
        } else {
            isValidUser = bcrypt.compareSync(req.body.password , dataUser.password);
        }

        if(isValidUser) {
            let userID = {
                user_Id : dataUser.email
            }
            let token = jwt.sign(userID , process.env.JWT_SECRET_KEY , {expiresIn : '3000s'});
            
            res.cookie("jwt" , token , {
                expires : new Date(Date.now() + cookieExpirationTime),
                httpOnly : true,
                // secure : true // for https
            })
            
            res.status(200).render('home');
            return ;
        } else {
            res.status(403).json({message : "Wrong Password"});
            return ;
        }
        
    } catch (error) {

        res.status(403).send({"Error while logging the user" : error.message});
        
    }

}

const fileUpload = async (req , res) => {
    
    let email = req.user;
    const newImage = {
        name : req.file.originalname,
        data : req.file.path,
        description : req.body.desc,
        date : Date()
    }
    await User.findOne({email})
    .then((_user) => {
        _user.photos.push(newImage);
        console.log(_user);
        _user.save();
    })
    .catch((err) => {
        console.log({"Error in file uploading API ":err});
    })

    res.send("file recieved");
}

const viewImages = async (req , res) => {
    
    let user = req.user;
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
            id : JSON.stringify(images[i]._id),
            img : images[i].data.toString()
        }
        resFile.push(image);
    }
    res.render('home' , {images : resFile});
}

const deleteImage = async (req , res) => {
    let user = req.user;
    let item = req.body.itemId;
    await User.findOne({email : user})
    .then((_user) => {
        _user.photos = _user.photos.filter((el) => {
            return JSON.stringify(el._id) != item;
        })
        _user.save();

        res.send(_user.photos);
    })

}


router.post('/register' , validatePassword , validateEmail , register);
router.get('/register' , (req , res) => {
    res.render('register')
})

router.post('/login' , validatePassword , validateEmail , login);
router.get('/login' , (req , res) => {
    res.render('login')
})

router.post('/upload-image' , upload.single('image') , validateToken , fileUpload);
router.get('/view-images' , validateToken , viewImages);
router.delete('/delete-image' , validateToken , deleteImage)


module.exports = router;

