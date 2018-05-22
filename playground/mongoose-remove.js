const {ObjectID} = require('mongodb');

// Local imports
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.remove({})
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    })

Todo.findOneAndRemove({}) /* sends the deleted doc back */
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    })

Todo.findByIdAndRemove({}) /* sends the deleted doc back */
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    })