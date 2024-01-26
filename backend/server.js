const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended : true}));
let url = process.env.DATABASE;
mongoose.connect(url).then(function() {
    console.log("database connected");
})

// Routes
const Routes = require('./routes');

app.use('/api' , Routes);

app.get('/' , (req , res) => {
    var filePath = path.resolve(__dirname  , '..');
    res.status(200).sendFile(filePath + '/frontend/index.html');
})

PORT = process.env.PORT;

if(PORT == null || PORT == undefined || PORT == "") 
{
    PORT = 3000;
}
app.listen(PORT , () => {
    
    console.log(`app is running on port ${PORT}`);
})