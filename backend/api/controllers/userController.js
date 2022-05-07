const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

exports.createUser = async function(user) {
    // hash and salt user's password
    user.password = await bcrypt.hash(user.password, 8);
    const newUser = await User.create(user);
    return newUser;
}

exports.getUserByUsername = async function(username, includePassword) {
    // Exclude password field if includePassword === false
    const user = await User.findOne({username: username}, includePassword ? {} : { password: 0 });
    return user;
}
