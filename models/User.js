const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;
const jwt = require('jsonwebtoken');



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

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword :12345678 , 암호화된 비밀번호:$2b$10$EVq1gQBq.3iA/crN7.UCJubtXGUBbJqEblh41mvl75Ir6NtIlRI0S
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
            cb(null, isMatch)
    })
}

    userSchema.methods.generateToken = function (cb) {
        var user = this;
        //jsonwebtoken을 이용하여 token 생성
        var token = jwt.sign(user._id.toHexString(), 'secretToken')

        user.token = token
        user.save(function (err, user) {
            if (err) return cb(err)
            cb(null, user)
        })
    }

    const User = mongoose.model('User', userSchema)

    module.exports = { User } 