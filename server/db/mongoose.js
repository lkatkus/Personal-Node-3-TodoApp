const mongoose = require('mongoose');

mongoose.Promise = global.Promise; /* settng mongoose to use default promises without any library */
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
};