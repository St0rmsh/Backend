const jwt = require("jsonwebtoken")



const JWT_SECRET = process.env.JWT_SECRET


async function IdentifyUser(req,res,next) {
    
        const token = req.cookies.token 
    
        if (!token) {
            return res.status(401).json({
                message:"Token not found"
            })
        }
    
        let decoded = null
    
        try {
            decoded =  jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return res.status(401).json({
                message:"Invalid token"
            })
        }

        req.user = decoded

        next()
}

module.exports = IdentifyUser