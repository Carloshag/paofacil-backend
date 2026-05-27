const { User } = require('./models');

const checkUsers = async () => {
    try {
        const users = await User.findAll({ raw: true });
        console.log('--- ALL USERS (JSON) ---');
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error fetching users:', err);
    } finally {
        process.exit();
    }
};

checkUsers();
