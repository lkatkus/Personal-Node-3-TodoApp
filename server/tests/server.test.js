// Dependency imports
const expect = require('expect');
const request = require('supertest');

// Local imports
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Function to be run before each test
beforeEach((done) => {
    Todo.remove({}) /* delete every todo in db */
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

                Todo.find() /* checking if anything was added */
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
                    expect(todos.length).toBe(0);
                    done();
                })
                .catch((err) => {
                    done(err);
                })
            })
    })
})