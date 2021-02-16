const users = [];

export default class UsersRepository {
    async findByEmail({ email }) {
        const user = users.find(c => c.email === email);
        return user ? { ...user } : null;
    }

    async create({ name, email, password }) {
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
        };

        users.push(user);
        return { ...user };
    }
}
