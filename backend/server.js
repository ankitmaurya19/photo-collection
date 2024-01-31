const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(bodyParser.json()); 
app.use(cors());

app.use(bodyParser.urlencoded({extended : true}));


let url = process.env.DATABASE;
mongoose.connect(url).then(function() {
    console.log("database connected");
})

// Routes
const Routes = require('./routes');

app.use('/api' , Routes);

app.set('view engine' , 'ejs');
app.set('views' , path.resolve(__dirname  , '../frontend'))


app.get('/' , (req , res) => {
    res.render('login')
})
app.get('/uploads/:image' , (req , res) => {
    let img = req.params.image;
    res.sendFile(`${__dirname}/uploads/${img}`);
})


PORT = process.env.PORT;

if(PORT == null || PORT == undefined || PORT == "") 
{
    PORT = 3000;
}
app.listen(PORT , () => {
    
    console.log(`app is running on port ${PORT}`);
})