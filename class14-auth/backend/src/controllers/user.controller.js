const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userModel = require("../models/user.models")




const JWT_SECRET = process.env.JWT_SECRET

const registerRoute = async(req,res)=>{

    const {username,email,password} = req.body

    const isEmailAlreadyRegistered = await userModel.findOne({email})

    if (isEmailAlreadyRegistered) {
       return  res.status(409).json({
            message:"Email is Already registered"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await  userModel.create({
        username,
        email,
        password:hash
    })
    
    const token = jwt.sign({
        id:user._id
    },JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered Successfully"
    })
}


const loginRoute = async(req,res)=>{

    const {email,password} = req.body

    const user = await userModel.findOne({email})

    if (!user) {
       return res.status(401).json({
            message:"Email is not registered "
        })
        
    }

    const isMatched = await bcrypt.compare(password, user.password)

    if (!isMatched) {
       return  res.status(401).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign({
        id:user._id
    },JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message:"User logged In Successfully"
    })

}

const logoutRoute = (req,res)=>{

    res.clearCookie("token")

    res.status(200).json({
        message:"User logged out Successfully"
    })
}



module.exports = {
    registerRoute,
    loginRoute,
    logoutRoute

}