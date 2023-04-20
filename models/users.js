const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },
    role:{
        required: true,
        type: Number
    },
    username:{
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    },
})

module.exports = mongoose.model('User', userSchema)