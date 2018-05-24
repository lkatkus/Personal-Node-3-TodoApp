// Dependency imports
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// Local imports
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { populateTodos, todos, users, populateUsers } = require('./seed/seed');

// Function to be run before each test
beforeEach(populateUsers);
beforeEach(populateTodos);

// Test if able to add new Todos to db through POST request
describe('POST /todos', () => { /* for grouping tests */
    it('should create a new todo', (done) => { /* done used for async */
        let text = 'Test todo text';

        request(app)
            .post('/todos') /* makes a POST request to /todos */
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(1);
            })
            .end(done);
    })
})

describe('GET /todos/:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should not get todo by id created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should return 404 invalid id provided', (done) => {
        request(app)
            .get('/todos/321')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should return 404 if no object found by provided id', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
})

describe('DELETE /todos/:id', () => {
    it('should delete todo by id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[0]._id.toHexString())
                    .then((todo) => {
                        expect(todo).toBeFalsy();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    })

    it('should not delete todo created by other user', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[0]._id.toHexString())
                    .then((todo) => {
                        expect(todo).toBeTruthy();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    })

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should return 404 if invalid id provided', (done) => {

        request(app)
            .delete(`/todos/1233`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    })
})

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
            })
            .end(done);
    })

    it('should clear completedAt when todo is not completed', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
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

    it('should update a todo created by other user', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true
            })
            .expect(404)
            .end(done);
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'test@test.com';
        let password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email})
                    .then((user) => {
                        expect(user.password).not.toBe(password);
                        done();
                    })
                
            });
    });

    it('should return validation error if request is invalid', (done) => {
        let email = 'email@email.com';
        let password = '123mnb!';

        request(app)
            .post('/users')
            .send({
                email:'and',
                pass:'123'
            })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email is in use', (done) => {
        let email = 'email@email.com';
        let password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
})

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[1]).toMatchObject({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            })
    })

    it('should reject if invalid', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[0].password
            })
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens).toHaveLength(1);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            })
    })
})

describe('DELETE /users/me/token', () => {
    it('should logout user', (done) => {
        request(app)
            .delete('/users/me/token') /* Sends delete requests */
            .set('x-auth', users[0].tokens[0].token) /* sets x-auth header to seed data header */
            .expect(200) /* expects to receive 200 status */
            .end((err, res) => { 
                if(err){
                    return done(err);
                }

                // Checks if token was delete
                User.findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens).toHaveLength(0)
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    })
})