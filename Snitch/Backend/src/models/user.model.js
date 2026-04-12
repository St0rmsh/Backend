import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function() { return !this.googleId; },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    contact: {
        countryCode: {
            type: String,
            required: function() { return !this.googleId; },
        },
        number: {
            type: String,
            required: function() { return !this.googleId; },
        },
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer',
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
}, { timestamps: true });




userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);


});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.forgotPasswordExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

    return resetToken;
}


const UserModel = mongoose.model('User', userSchema);

export default UserModel;