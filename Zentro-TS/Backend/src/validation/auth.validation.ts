import {body , validationResult} from "express-validator"
import {type Request, type Response, type NextFunction} from "express"

const validateRequest = (req: Request,res: Response,next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        })
    }
    next()
}


export const validateRegister = [
    body("username")
  .trim()
  .notEmpty().withMessage("Username is required")
  .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("Username can only contain letters, numbers, and underscores"),


    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .normalizeEmail()
    .isEmail().withMessage("Email is invalid"),
    
    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({min: 6}).withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=\[\]]/)
    .withMessage("Password must contain at least one special character"),
    
    body("fullname")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({min: 2}).withMessage("Full name must be at least 2 characters"),
    
    validateRequest
]