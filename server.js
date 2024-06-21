//import
//setting부
const express = require('express');
var mysql = require("mysql");
const bodyParser = require('body-parser');

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


// 리스트 조회
app.get('/landPage', (req, res)=>{
    const rows = conn.query("select * from land", function (err, rows, fields) {
        if (err){
            console.log(err);
        }else{
          console.log(rows);
          res.render('landPage.ejs',{data:rows})
        }
      });
});


// 상세 게시물 조회 (& 수정 페이지로 이동)
// land_id가 숫자인 경우에만 동작해서 정규식 추가
app.get('/landPage/:land_id(\\d+)', (req, res) => {
    const id = req.params.land_id;
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


// 게시물 Insert
app.post('/landInsert', function(req, res){
    console.log('add start')
    // SQL 쿼리 실행
    conn.query("INSERT INTO land VALUES (NULL,?, ?, ?, ?, ?,?)",
        [req.body.name, req.body.location, req.body.unit_size, req.body.price_per_square_meter, req.body.construction_company, req.body.parking_ratio],
        function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                // 성공적으로 쿼리가 실행되면 200 상태 코드로 응답
                res.redirect('/landPage')
                res.status(200).send();
            }
    });
});


// 게시물 수정
app.post('/editLand/:id(\\d+)', (req, res) => {
    const id = req.params.id;

    // unit_size에서 m² 제거, 빈칸 제거
    req.body.unit_size = req.body.unit_size.replace('m²', '').trim();

    // price_per_square_meter 에서 숫자만 추출
    req.body.price_per_square_meter = req.body.price_per_square_meter.replace(/[^0-9]/g, '');

    const { location, unit_size, price_per_square_meter, construction_company, parking_ratio } = req.body;

    const sql = `
        UPDATE land 
        SET 
            location = ?, 
            unit_size = ?, 
            price_per_square_meter = ?, 
            construction_company = ?, 
            parking_ratio = ?
        WHERE 
            land_id = ?
    `;

    const values = [location, unit_size, price_per_square_meter, construction_company, parking_ratio, id];

    conn.query(sql, values, function(err, result){
        if(err){
            console.log("Update Error");
            throw err;
        }else{
            console.log("Update Success");
            res.redirect('/landPage');
        }
    });
});


// 게시물 삭제
app.post('/landDelete', function(req, res){
    console.log(req.body.land_id);
    
    conn.query("delete from land where land_id=?",[req.body.land_id], function (err, rows, fields) {
        if (err){
            console.log(err);
            res.status(500).send();
        }
        else{
            res.status(200).send();
        }
    });
});