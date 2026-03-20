import jwt from "jsonwebtoken"



const JWT_SECRET = process.env.JWT_SECRET

export const authMiddleware = (req,res,next) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message:"Token Not Found",
            success:false
        })
    }

    try {
      
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch(error) {

        return res.status(401).json({
            message:"Unauthorized user",
            success:false,
            err:"Invalid Token"
        })
    }

}