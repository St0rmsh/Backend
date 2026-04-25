import userDao from "../daos/user.dao.js";

class UserService {
    async getUserById(id) {
        return await userDao.findById(id);
    }

    async getUserByEmail(email) {
        return await userDao.findByEmail(email);
    }

    async createUser(userData) {
        return await userDao.create(userData);
    }

    async updateUser(id, updateData) {
        return await userDao.updateById(id, updateData);
    }
}

export default new UserService();
