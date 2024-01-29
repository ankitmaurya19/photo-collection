const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        required : true
    },
    password :{
        type : String,
        trim : true,
        required : true
    },
    photos : [
        {
            data : Buffer,
            contentType : String,
            name : String,
            description : String,
            date : Date
        }
    ]
} , {timestamps : true});

module.exports = mongoose.model('user' , userSchema);