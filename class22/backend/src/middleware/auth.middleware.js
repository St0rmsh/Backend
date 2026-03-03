const jwt = require("jsonwebtoken")
const redis = require("../config/cache")



async function identifyUser(req,res,next) {
    
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            message:"Token is required"
        })
    }

    const isTokenValid  = await redis.get(token)

    if (isTokenValid) {
        return res.status(401).json({
            message:"Token Expired"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        return res.status(400).json({
            message:"Invalid token"
        })
    }

    req.user = decoded
    next()
}

module.exports = identifyUser