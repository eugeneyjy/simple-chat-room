const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

exports.createUser = async function(user) {
    // hash and salt user's password
    user.password = await bcrypt.hash(user.password, 8);
    if(!user.icon) {
        // generate random string
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 8; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        // give user random icon
        user.icon = `https://avatars.dicebear.com/api/human/${result}.svg`;
    }
    const newUser = await User.create(user);
    return newUser;
}

exports.getUserByUsername = async function(username, includePassword) {
    // Exclude password field if includePassword === false
    const user = await User.findOne({username: username}, includePassword ? {} : { password: 0 });
    return user;
}

exports.getUserById = async function(userId, includePassword) {
    const user = await User.findById(userId, includePassword ? {} : { password: 0 });
    return user;
}