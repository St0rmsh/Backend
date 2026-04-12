import { body, validationResult } from 'express-validator';

 const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	next();
};

export const registerValidator = [
	body('fullname')
		.trim()
		.notEmpty()
		.withMessage('Full name is required'),

	body('email')
		.trim()
		.isEmail()
		.withMessage('A valid email is required')
		.bail()
		.normalizeEmail(),

	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long')
		.matches(/[A-Z]/)
		.withMessage('Password must contain at least one uppercase letter')
		.matches(/[0-9]/)
		.withMessage('Password must contain at least one number'),

	body('contact.countryCode')
		.notEmpty()
		.withMessage('Country code is required')
		.matches(/^\+\d{1,3}$/)
		.withMessage('Format: +91'),

	body('contact.number') 
		.notEmpty()
		.withMessage('Contact number is required')
		.matches(/^[6-9]\d{9}$/)
		.withMessage('Enter a valid 10-digit Indian number'),

	body('role')
		.isIn(['buyer', 'seller'])  
		.withMessage('Role must be either "buyer" or "seller"')
        .optional()
,

	validate,
];


export const loginValidator = [
	body('email')
		.trim()
		.isEmail()
		.withMessage('A valid email is required')
		.normalizeEmail(),

	body('password')
		.notEmpty()
		.withMessage('Password is required'),

	validate,
];

export const completeProfileValidator = [
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long')
		.matches(/[A-Z]/)
		.withMessage('Password must contain at least one uppercase letter')
		.matches(/[0-9]/)
		.withMessage('Password must contain at least one number'),

	body('contact.countryCode')
		.notEmpty()
		.withMessage('Country code is required')
		.matches(/^\+\d{1,3}$/)
		.withMessage('Format: +91'),

	body('contact.number')
		.notEmpty()
		.withMessage('Contact number is required')
		.matches(/^[6-9]\d{9}$/)
		.withMessage('Enter a valid 10-digit Indian number'),

	body('role')
		.optional()
		.isIn(['buyer', 'seller'])
		.withMessage('Role must be either "buyer" or "seller"'),

	validate,
];

export const forgotPasswordValidator = [
	body('email')
		.trim()
		.isEmail()
		.withMessage('A valid email is required')
		.normalizeEmail(),

	validate,
];

export const resetPasswordValidator = [
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long')
		.matches(/[A-Z]/)
		.withMessage('Password must contain at least one uppercase letter')
		.matches(/[0-9]/)
		.withMessage('Password must contain at least one number'),

	validate,
];
