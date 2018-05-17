const ENV = process.env.NODE_ENV || 'development';

if(ENV === 'development'){
    console.log('Development environment');
}else if(ENV === 'test'){
    console.log('Test environment');
}

// Dependency imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

// Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

// Express app setup
const app = express();

const PORT = process.env.PORT || 3000; /* process.env.PORT for heroku deployement. */

// Middleware
app.use(bodyParser.json());

// Routes
// GET ALL
app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send(todos);
        })
        .catch((err) => {
            res.status(400).send();
        })
});

//GET BY ID
app.get('/todos/:id', (req, res) => {
    if(ObjectID.isValid(req.params.id)){ /* Checking if provided id is valid */
        Todo.findById(req.params.id)
        .then((todo) => {
            if(!todo){ /* check if anything was found */
                return res.status(404).send()
            }

            res.status(200).send({todo});
        })
        .catch((err) => {
            res.status(400).send();
        })
    }else{
        res.status(404).send();
    }
})

// CREATE
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })

    todo.save()
    .then((doc) => {
        res.send(doc);
    })
    .catch((err) => {
        res.status(400).send();
    })
});

// DELETE
app.delete('/todos/:id', (req, res) => {
    if(ObjectID.isValid(req.params.id)){ /* Checking if provided id is valid */
        Todo.findByIdAndRemove(req.params.id)
        .then((todo) => {
            if(!todo){ /* check if anything was found */
                return res.status(404).send()
            }

            res.status(200).send({todo});
        })
        .catch((err) => {
            res.status(404).send();
        })
    }else{
        res.status(404).send();
    }
})

// PATCH
app.patch('/todos/:id', (req, res) => {
    let body = _.pick(req.body, ['text', 'completed']);

    if(ObjectID.isValid(req.params.id)){ /* Checking if provided id is valid */

        // Checks if task is completed and if it is true then sets the completedAt
        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        }else{
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true})
            .then((todo) => {
                if(!todo){
                    return res.status(404).send();    
                }
                res.status(200).send({todo});
            })
            .catch((err) => {
                res.status(404).send();
            })
    }else{
        res.status(404).send();
    }
})

// Server listener
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

module.exports = {
    app
};