const express = require('express');
const router = express.Router();

const Auth = require("../model/auth");
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');

router.use(bodyParser.json());




router.post('/registration',(req,res,next)=>{
    const auth = new Auth({
        _id: new mongoose.Types.ObjectId,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role
    })

    Auth
    .findByEmail(req.body.email)
    .then((result) =>{
        res.status(409).json({
            message:"This email already registered with ".concat(result.role)
        })
    }).catch((ex) =>{
        auth
        .save()
        .then((result) =>{
            res.status(200).json({
                message:"Register Success",
            })
        })
        .catch((err) => {
            res.status(500).json({
                message:"Something went wrong"
            })
        })
    })

   


})


router.post('/login',(req,res,next) =>{
    Auth
    .findByEmail(req.body.email)
    .exec()
    .then((result) =>{
    if(req.body.password === result.password){
        res.status(200)
        .json({
            message:"Login Success",
            role :result.role
        })
    }else{
        res.status(401)
        .json({message: "Invalid Credentails"})
    }
       
    })
    .catch((ex) => {
        res.status(500).json({
            message:"Something Went Wrong"
        })
    })


})

module.exports = router;
