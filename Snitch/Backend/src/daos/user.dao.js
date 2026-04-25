import User from "../models/user.model.js";

class UserDAO {
    async findById(id) {
        return await User.findById(id).select("-password");
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async updateById(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");
    }

    async deleteById(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new UserDAO();
