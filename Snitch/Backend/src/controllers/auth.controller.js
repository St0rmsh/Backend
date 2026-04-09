import UserModel from "../models/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password, contact, role } = req.body;

        const existingUser = await UserModel.findOne({ 
            $or:[{ email: email }, { 'contact.number': contact.number }]
         });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new UserModel({
            fullname,
            email,
            password,
            contact,
            role
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully',
                user: {
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    contact: user.contact,
                    role: user.role
                }

         });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};