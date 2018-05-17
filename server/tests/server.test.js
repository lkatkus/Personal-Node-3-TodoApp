// Dependency imports
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// Local imports
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Testing todo list
const todos = [
    {text: 'First todo test', _id: new ObjectID()},
    {text: 'Second todo test', _id: new ObjectID(), completed: true, completedAt: 333}
]

// Function to be run before each test
beforeEach((done) => {
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
});

// Test if able to add new Todos to db through POST request
describe('POST /todos', () => { /* for grouping tests */
    it('should create a new todo', (done) => { /* done used for async */
        let text = 'Test todo text';

        request(app)
            .post('/todos') /* makes a POST request to /todos */
            .send({ text }) /* sends object with text:text */
            .expect(200) /* expects to receive OK code */
            .expect((res) => {
                expect(res.body.text).toBe(text); /* expects text in respone to be equal to sent text */
            })
            .end((err, res) => {
                if(err){ /* error handling */
                    return done(err); /* return to prevent further execution and done to finish testing */
                }

                Todo.find({text}) /* checking if anything was added */
                .then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
            })
    })

    it('should not create a new todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({}) /* send empty object to test validation */
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find() /* checking if anything was added */
                .then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should return 404 invalid id provided', (done) => {
        request(app)
            .get('/todos/321')
            .expect(404)
            .end(done);
    })

    it('should return 404 if no object found by provided id', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    })
})

describe('DELETE /todos/:id', () => {
    it('should delete todo by id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })
})

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
            })
            .end(done);
    })

    it('should clear completedAt', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({
                completed: false,
                completedAt: null
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
            })
            .end(done);
    })
})