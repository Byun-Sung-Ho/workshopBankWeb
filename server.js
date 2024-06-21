//setting부

//import
const express = require('express');
const bodyParser = require('body-parser');
var mysql = require("mysql");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "workshopBankWeb", 
});

conn.connect(function(err){
    if(err){
        console.log("Mysql 연결 실패 :: "+ err);
    }else{
        console.log("Mysql 연결 성공");
    }
});

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('static'));


//api부
app.listen(8080, function(){
    console.log('server ready');
});

// 게시물 조회
app.get('/landPage/:id', (req, res) => {
    // TEST ========= TODO : 나중에 수정 후 삭제
    const id = req.params.id;
    // const id = 3;

    const sql = `SELECT * FROM land WHERE land_id = ${id}`;
    
    conn.query(sql, function(err, rows, fields){
        if(err){
            console.log("Query Error");
            throw err;
        }else{
            console.log(rows);
            res.render('landDetail.ejs', {data:rows});
        }
    });

});