//import
//setting부
const express = require('express');
var mysql = require("mysql");
const bodyParser = require('body-parser');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
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

// 상세 게시물 조회
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


// 게시물 수정 페이지로 이동
app.get('/editLand/:id(\\d+)', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM land WHERE land_id = ${id}`;

    conn.query(sql, function(err, rows, fields){
        if(err){
            console.log("Query Error");
            throw err;
        }else{
            console.log(rows);
            res.render('landDetail.ejs', {data: rows});
        }
    });
});

// 게시물 Update
app.post('/updateLand/:id(\\d+)', (req, res) => {
    const id = req.params.id;
    console.log('id >>>>>>>>>>>>>: ', id);
    console.log('req.body >>>>>>>>>>>>>: ', req.body);
    const { name, location, unit_size, price_per_square_meter, construction_company, parking_ratio } = req.body;

    const sql = `
        UPDATE land 
        SET 
            name = ?, 
            location = ?, 
            unit_size = ?, 
            price_per_square_meter = ?, 
            construction_company = ?, 
            parking_ratio = ?
        WHERE 
            land_id = ?
    `;


    console.log('sql >>>>>>>>>>>>>: ', sql);

    const values = [name, location, unit_size, price_per_square_meter, construction_company, parking_ratio, id];

    conn.query(sql, values, function(err, result){
        if(err){
            console.log("Update Error");
            throw err;
        }else{
            console.log("Update Success");
            res.redirect(`/landPage/${id}`);
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
})
