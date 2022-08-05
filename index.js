const express = require('express');

const app = express();

const cors = require('cors');

const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;


const dotenv = require("dotenv").config();

const URL= process.env.DB;

const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

app.use(express.json());

app.use(cors({
    orgin : "*"
}));



let auth = function (req , res , next){
    console.log(req.headers)
    if(req.headers.authorization){
        let verify = jwt.verify(req.headers.authorization , SECRET);
        if(verify){
            console.log(verify)
            // if( req.userCheck = verify._id){
                req.userCheck = verify._id;
                next();
            // }else{
                // req.adminCheck = verify._id;
                // next();
            // }
          
        }
    }else{
        res.status(401).send({message : "You are not authorized"});
    }
}


// user Register 

app.post("/usersregister", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');

        const salt = await bcryptjs.genSalt(10);
        // console.log(salt)
        const hash = await bcryptjs.hash(req.body.password, salt);
        // console.log(hash)
        req.body.password = hash;
        await db.collection('users').insertOne(req.body);
        await connection.close();
            res.json({
                message : "User registered successfully"
            })
    }
    catch{
        console.log(error)
    }
})


app.get("/usersregister", async(req, res) => {
   
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const user =  await db.collection('users').find().toArray();
        await connection.close();
            res.json(user)
    }
    catch{s
        console.log(error)
    }
})

app.get("/usersregister/:id" , async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const user =  await db.collection('users').findOne(({_id : mongodb.ObjectId(req.params.id)}));
        await connection.close();
        res.json(user)
    }
    catch(error){
        console.log(error)
    }
})

app.put("/usersregister/:id", async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('users').updateOne({_id : mongodb.ObjectId(req.params.id)}, {$set : req.body});
        await connection.close();
        res.json({
            message : "User updated successfully"
        })

    }
    catch(error){
        console.log(error)
    }
})

app.delete("/usersregister/:id", async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('users').deleteOne({_id : mongodb.ObjectId(req.params.id)});
        await connection.close();
        res.json({
            message : "User deleted successfully"
        })

    }
    catch(error){
        console.log(error)
    }
})

// User Login 

app.post("/userlogin", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
       let userCheck = await db.collection('users').findOne({username : req.body.username});
         if(userCheck){
            const match = await bcryptjs.compare(req.body.password, userCheck.password);
            if(match){
                const token = jwt.sign({_id : userCheck._id}, SECRET , {expiresIn : "5m"});
                res.status(200).json({
                    message : "User logged in successfully",
                    token
                })
            }else{
                res.status(401).json({error : "Invalid password"})
                
            }
         }else{
            res.status(401).json({
                error : "User not found"
            })
         }
        await connection.close();
           
    }
    catch(error){
        console.log(error)
    }
})



// admin Register

app.post("/adminregister", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        req.body.password = hash;
        await db.collection('admin').insertOne(req.body);
        await connection.close();
            res.json({
                message : "Admin registered successfully"
            })
    }
    catch(error){
        console.log(error)
    }
})


app.get("/adminregister", async(req, res) => {
   
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const admins =  await db.collection('admin').find().toArray();
        await connection.close();
            res.json(admins)
    }
    catch(error){
        console.log(error)
    }
})



// adminlogin 

app.post("/adminlogin", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
       let adminCheck = await db.collection('admin').findOne({username : req.body.username});
         if(adminCheck){
            const match = await bcryptjs.compare(req.body.password, adminCheck.password);
            if(match){
                const token = jwt.sign({_id : adminCheck._id}, SECRET , {expiresIn : "5m"});
                res.status(200).json({
                    message : "admin logged in successfully",
                    token
                })
            }else{
                res.status(401).json({
                    error : "Password is incorrect"
                })
            }
         }else{
            res.status(401).json({
                error : "admin not found"
            })
         }
        await connection.close();
           
    }
    catch(error){
        console.log(error)
    }
})



// theatres


app.post("/theatres", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('theatrelists').insertOne(req.body);
        await connection.close();
            res.status(200).send({
                message : "Theatre added successfully"
            })
    }
    catch(error){
        console.log(error)
    }
})


app.get("/theatres", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const theatre =  await db.collection('theatrelists').find().toArray();
        await connection.close();
        res.json(theatre)
    }
    catch(error){
        console.log(error)
    }
})


app.get("/theatres/:id", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const theatre =  await db.collection('theatrelists').findOne(({_id : mongodb.ObjectId(req.params.id)}));

        await connection.close();
        res.json(theatre)
    }
    catch(error){
        console.log(error)
    }
})


app.put("/theatres/:id", async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('theatrelists').updateOne({_id : mongodb.ObjectId(req.params.id)}, {$set : req.body});
        await connection.close();
        res.json({
            message : "Theatre Name updated successfully"
        })

    }
    catch(error){
        console.log(error)
    }
})

app.delete("/theatres/:id", async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('theatrelists').deleteOne({_id : mongodb.ObjectId(req.params.id)});
        await connection.close();
        res.json({
            message : "Theatre deleted successfully"
        })

    }
    catch(error){
        console.log(error)
    }
})




// movies 

//  post one

app.post("/movies", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('moviedatas').insertOne(req.body);
        await connection.close();
            res.status(200).send({
                message : "Movie added successfully"
            })
    }
    catch(error){
        console.log(error)
    }
})

// post many 

app.post("/movies", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('moviedatas').insertMany(req.body);
        await connection.close();
            res.status(200).send({
                message : "Movies added successfully"
            })
    }
    catch(error){
        console.log(error)
    }
})


app.get("/movies", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const movies =  await db.collection('moviedatas').find().toArray();
        await connection.close();
        res.json(movies)
    }
    catch(error){
        console.log(error)
    }
})

app.get("/movies/:id", async(req, res) => {
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        const movies =  await db.collection('moviedatas').findOne(({_id : mongodb.ObjectId(req.params.id)}))
        await connection.close();
        res.json(movies)
    }
    catch(error){
        console.log(error)
    }
})

app.put("/movies/:id", async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('moviedatas').updateOne({_id : mongodb.ObjectId(req.params.id)},
    
        { $set: {               
           
            name : req.body.name,         
            poster: req.body.poster,
            rating: req.body.rating,
            summary:req.body.summary,
            trailer: req.body.trailer,
            screen: req.body.screen,
            languages: req.body.languages,
            certificate: req.body.certificate,
    
           } })

        await connection.close();
        res.json({
            message : "Movie Details updated successfully"
        })

    }
    catch(error){
        console.log(error)
    }
})

app.delete("/movies/:id", async(req,res) =>{
    try{
        const connection = await MongoClient.connect(URL);
        const db = connection.db('hackathon');
        await db.collection('moviedatas').deleteOne({_id : mongodb.ObjectId(req.params.id)});
        await connection.close();
        res.json({
            message : "Movie deleted successfully"
        })

    }
    catch(error){
        console.log(error)
    }
})




app.listen( process.env.PORT || 4000, () => {
  console.log('Server is running on port 4000');
})