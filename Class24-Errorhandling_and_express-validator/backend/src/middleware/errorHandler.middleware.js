import dotenv from "dotenv"

dotenv.config()

export function HandleError(err,req,res,next){

    const statusCode = err.status || 500


    if (process.env.NODE_ENV === "development") {
        return  res.status(statusCode).json({
            success: false,
        message:err.message || "Internal Server Error",
        stack:err.stack
    })
    }

    res.status(statusCode).json({
        success: false,
        message:err.message || "Internal Server Error"
    })
}