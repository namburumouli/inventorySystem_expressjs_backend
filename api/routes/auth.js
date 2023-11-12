const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');

const Auth = require("../model/auth");
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');

router.use(bodyParser.json());





router.post('/registration', async (req, res, next) => {
    try {
        const existingUser = await Auth.findByEmail(req.body.email);

        if (existingUser) {
            return sendErrorResponse(res, HttpStatus.CONFLICT, `This email is already registered with ${existingUser.role}`);
        }

        const newUser = new Auth({
            _id: new mongoose.Types.ObjectId,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });

        await newUser.save();
        sendSuccessResponse(res, HttpStatus.OK, 'Registration successful');
    } catch (error) {
        sendErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }
});

function sendSuccessResponse(res, status, message) {
    res.status(status).json({
        message: message,
    });
}

function sendErrorResponse(res, status, message) {
    res.status(status).json({
        message: message,
    });
}


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
