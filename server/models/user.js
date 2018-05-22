// Dependency imports
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true, /* Trims white spaces before and after */
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'superSalt').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save()
        .then(() => {
            return token;
        });
}

UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;

    try{
        decoded = jwt.verify(token, 'superSalt');
    }catch(e){
        // return new Promise((resolve, reject) => {
        //     reject();
        // })

        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

}

// Setting up mongoose model
const User = mongoose.model('User', UserSchema);

// Create new User instance
let user = new User({

});

// Saving created instance to db
// user.save()
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Export
module.exports = {
    User
}