const {ObjectID} = require('mongodb');

// Local imports
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = '5afc33f11ddc076147181a33';

if(ObjectID.isValid(id)){

    Todo.find({ _id: id }) /* mongoose converts id to ObjectID */
    .then((todos) => {
        console.log(todos); /* if id is false find() returns an empty array */
    })
    .catch((err) => {
        console.log('Invalid id');
    })

Todo.findOne({_id: id})
    .then((todo) => {
        console.log(todo); /* if id is false findOne() returns null, else returns an object */
    })
    .catch((err) => {
        console.log('Invalid id');
    })

Todo.findById(id)
    .then((todo) => {
        if(!todo){
            return console.log('Id not found'); /* if id is not found it does not throw an error so return result should be checked */
        }

        console.log(todo); /* if id is false findById() returns null */
    })
    .catch((err) => {
        console.log('Invalid id');
    })
    
}else{
    console.log('ID not valid');
}

