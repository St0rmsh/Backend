const jwt = require("jsonwebtoken")



async function IdentifyUser(req,res,next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message:"Token not found"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        return res.status(403).json({
            message:"Invalid Token"
        })
    }

    req.user = decoded
    next()
    
}

module.exports = IdentifyUser