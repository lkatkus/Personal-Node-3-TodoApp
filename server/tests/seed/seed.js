const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');

// Testing todo list
const todos = [
    {text: 'First todo test', _id: new ObjectID()},
    {text: 'Second todo test', _id: new ObjectID(), completed: true, completedAt: 333}
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'email@email.com',
        password: 'user1pass',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, 'superSalt').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'derp@derp.com',
        password: 'user2pass'
    }
];

const populateTodos = (done) => {
    Todo.remove({}) /* delete every todo in db */
        .then(() => {
            Todo.insertMany(todos);
        })
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        })    
}

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();

            Promise.all([userOne, userTwo]) /* utility to wait for all promises to finish */
        })
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}