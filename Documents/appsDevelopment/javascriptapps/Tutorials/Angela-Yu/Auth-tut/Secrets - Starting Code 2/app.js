//jshint esversion
//installing the required modules
require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const bp = require('body-parser'); 
const mysql = require('mysql');
const AES = require('mysql-aes-binary'); 

//setting up the application server
const app = express(); 


app.use(express.static("public"))
app.set('view engine', 'ejs'); 
app.use(bp.urlencoded({extended:true})); 

//seting up the connection string 
var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB__PASSWORD,
    database : process.env.DB_SCHEMA
  });

//Setting up the routes 
app.get("/", function(req,res){

    console.log(process.env.SECRET); 
    res.render("home"); 

}) 

app.get("/login", function(req,res){
    res.render("login"); 

}) 

app.post("/login", function(req, res){
    const email = req.body.username; 
    const password = req.body.password;  

    //encrypted credentials
    const encryptedEmail = AES.encrypt(email,process.env.SECRET); 
    const encryptedPassword = AES.encrypt(password,process.env.SECRET); 

    var sqlPartOne = `select * FROM myUser.UserTable where email=`;
    let sql = sqlPartOne.concat("'" +  encryptedEmail+"';");
console.log(sql); 
    connection.query(sql, function(errors, results, fields){

        console.log(results + " "+sql); 


        if(errors !== null){
            console.log("Email does not exist")
            connection.end(()=>{})
            res.send("Email doesn't exist"); 
            
        }else{
            
          

            console.log(results[0].password + " \n returned password")
            var resp = results[0].password; 
            if( resp == encryptedPassword){

                console.log("User is existing")
                res.render("secrets"); 
            }else{
                console.log("Incorrect Password")
            }
            
            
        }
        

    })

})

app.get("/register", function(req,res){
    res.render("register"); 

}) 

app.post("/register", function(req, res){
  

    const userName = req.body.username; 
    const password = req.body.password; 

    //Encrypted username and password 
    const encryptUsername = AES.encrypt(userName, process.env.SECRET); 
    const encryptPassword = AES.encrypt(password, process.env.SECRET); 

    var sqlPartOne = `INSERT INTO myUser.UserTable (email,password) VALUES (`;
    let sql = sqlPartOne.concat("'" +  encryptUsername+"', ","'"+encryptPassword+"' ", ");");

    console.log(encryptPassword+" \n Saved Password");

    connection.query(sql,function(error, results, fields){

        if(error){
            console.log(error)
        } else{
            res.render("secrets")
        }
    })
    
    connection.end(function(err){

    }); 

})



app.listen(3003, function(){
    console.log("Server started on port 3003"); 

})