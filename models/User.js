const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) { //index.js에 있는 user.save를 하기 전에 function을 먼저 작동
    var user = this;

    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err) return next(err)
                user.password = hash 
                next()
            });
        });
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User } // 다른 파일에서도 사용할 수 있게 exports 