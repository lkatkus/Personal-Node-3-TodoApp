// Dependency imports
const express = require('express');
const bodyParser = require('body-parser');

// Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

// Express app setup
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes

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
        res.status(400).send(err);
    })
})

// Server listener
app.listen(3000, () => {
    console.log('Server started on port 3000');
})

module.exports = {
    app
};