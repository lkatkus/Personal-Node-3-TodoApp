// Setting env variables
require('./config/config');

// Dependency imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

// Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

// Middleware imports
const {authenticate} = require('./middleware/authenticate');

// Express app setup
const app = express();

const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// TODOS ROUTES
// GET ALL
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    })
        .then((todos) => {
            res.send(todos);
        })
        .catch((err) => {
            res.status(400).send();
        })
});

//GET BY ID
app.get('/todos/:id', authenticate, (req, res) => {
    if(ObjectID.isValid(req.params.id)){ /* Checking if provided id is valid */
        Todo.findOne({
            _id: req.params.id,
            _creator: req.user._id
        })
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
app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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
app.delete('/todos/:id', authenticate, (req, res) => {
    if(ObjectID.isValid(req.params.id)){ /* Checking if provided id is valid */
        Todo.findOneAndRemove({
            _id: req.params.id,
            _creator: req.user._id
        })
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
app.patch('/todos/:id', authenticate, (req, res) => {
    let body = _.pick(req.body, ['text', 'completed']);

    if(ObjectID.isValid(req.params.id)){ /* Checking if provided id is valid */

        // Checks if task is completed and if it is true then sets the completedAt
        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        }else{
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findOneAndUpdate({
            _id: req.params.id,
            _creator: req.user._id
        }, {$set: body}, {new: true})
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


// USERS ROUTES
// CREATE
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email','password']); /* get only email and password from request body */
    let user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((err) => {
            res.status(400).send(err);
        })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

// LOGIN ROUTE
app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email','password']); /* get only email and password from request body */
    
    User.findByCredentials(body.email, body.password)
        .then((user) => {
            return user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token).send(user);
                })
        })
        .catch((err) => {
            res.status(400).send();
        })
})

// LOGOUT ROUTE
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            res.status(400).send();
        })
});

// Server listener
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

module.exports = {
    app
};