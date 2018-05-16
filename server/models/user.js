const mongoose = require('mongoose');

// Setting up mongoose model
const User = mongoose.model('User', {
    email:{
        type: String,
        required: true,
        trim: true, /* Trims white spaces before and after */
        minlength: 1
    }
});

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