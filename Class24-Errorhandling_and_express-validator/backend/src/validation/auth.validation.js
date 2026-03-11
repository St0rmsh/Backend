import { body, validationResult } from "express-validator";


const validate = (req,res,next)=>{
   const errors = validationResult(req)


   if (errors.isEmpty()) {
    return next()
   }


   res.status(409).json({
    errors:errors.array()
   })
}


export const registerValidator = [
    body("username").isString().withMessage("Username should be String"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").custom((value)=>{

        const regix = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!regix.test(value)) {
            throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&)")
        }
        return true
    }),
    validate

]