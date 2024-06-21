//import
//setting부
const express = require('express');
var mysql = require("mysql");
const bodyParser = require('body-parser');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "workshopbankweb",
});

conn.connect();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('static'));


//api부

app.listen(8080, function(){
    console.log('server ready');
});

app.get('/landPage', (req, res)=>{
    const rows = conn.query("select * from land", function (err, rows, fields) {
        if (err){
            console.log(err);
        }else{
          console.log(rows);
          res.render('landPage.ejs',{data:rows})
        }
      });
})