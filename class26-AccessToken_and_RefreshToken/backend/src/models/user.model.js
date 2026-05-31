import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    const saltRound = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, saltRound);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


const User = mongoose.model("User", userSchema);

export default User;