// Dependency imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

// Express app setup
const app = express();

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

// Server listener
app.listen(3000, () => {
    console.log('Server started on port 3000');
})

module.exports = {
    app
};