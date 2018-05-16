const mongoose = require('mongoose');

mongoose.Promise = global.Promise; /* settng mongoose to use default promises without any library */
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};