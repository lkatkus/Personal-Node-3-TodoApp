const mongoose = require('mongoose');

// Setting up schema
    // let todoSchema = new Schema({
    //     text: {
    //         type: String,
    //         required: true
    //     },
    //     completed: {
    //         type: Boolean
    //     },
    //     completedAt: {
    //         type: Number
    //     }
    // })

    // let Todo = mongoose.model('Todo', todoSchema);

// Setting up mongoose model
    const Todo = mongoose.model('Todo', {
        text: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Number,
            default: null
        },
        _creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    });

// Creating new Todo instance
    let newTodo = new Todo({
        text: '  best  '
    });

// Saving created instance to db
    // newTodo.save()
    //     .then((doc) => {
    //         console.log(doc);
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     });

// Export
module.exports = {
    Todo
}