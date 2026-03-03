const jwt = require("jsonwebtoken")
const blacklistingModel = require("../models/blacklisting.model")
const redis = require("../config/cache")



async function IdentifyUser(req,res,next) {
    
    const token = req.cookies.token

    if (!token) {
        return res.status(409).json({
            message:"Token not Found"
        })
    }

    const isBlackListed = await redis.get(token)

    if (isBlackListed) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message:"Token not Found"
        })
        
    }


}


module.exports = {
    IdentifyUser
}