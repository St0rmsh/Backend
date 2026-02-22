const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const JWT_SECRET = process.env.JWT_SECRET

async function registerController(req,res) {

    const {username,email,password,bio,profileImg} = req.body

    const isUserExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]

       
    })


     if (isUserExists) {
          return res.status(409).json({
            message:"User is already registered"
          })  
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password:hash,
            bio,
            profileImg
        })

        const token = jwt.sign({
            id:user._id,
            username:user.username
        }, JWT_SECRET ,{expiresIn:"7d"})


        res.cookie("token", token)


        res.status(201).json({
            message:"User registered Successfully",
            user:{
                username:user.username,
                email:user.email,
                bio:user.bio,
                profileImg:user.profileImg
            },
            token
        })
    
}


async function loginController(req,res){

    const {username,email,password} = req.body

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if (!user) {
        return res.status(401).json({
            message:"User is not registered  "
        })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(401).json({
            message:"Incorrect Credentials"
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username
    },JWT_SECRET, {expiresIn:"7d"})

    res.cookie("token", token)

    res.status(200).json({
        message:"User registered Successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImg:user.profileImg
        },
         token

    })
}


async function getMe(req,res){
    const userId = req.user.id


    const user = await userModel.findById(userId)

    res.status(200).json({
        message:"user fetched",
        user
    })
}









module.exports = {
    registerController,
    loginController,
    getMe
}