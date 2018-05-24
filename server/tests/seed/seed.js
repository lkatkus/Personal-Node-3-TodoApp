const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const jwt = require('jsonwebtoken');

// Testing todo list


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
    {
        text: 'First todo test',
        _id: new ObjectID(),
        _creator: userOneId
    },
    {
        text: 'Second todo test',
        _id: new ObjectID(),
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const users = [
    {
        _id: userOneId,
        email: 'email@email.com',
        password: 'user1pass',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'derp@derp.com',
        password: 'user2pass',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
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