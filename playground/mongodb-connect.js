// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    if(err){
        return console.log('Unable to connect to database.'); /* return is used to prevent further execution of programm if err exists */
    }
    
    let db = client.db('TodoApp')

    console.log('Connected to MongoDb server');

    db.collection('Todos').insertOne({
        text: 'Random todo',
        completed: false
    }, (err, result) => {
        if(err){
            return console.log('Unable to insert todo', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    // db.collection('Users').insertOne({
    //     name: 'Lemon',
    //     age: 30,
    //     location: 'Lithuania'
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert todo', err)
    //     }
        
    //     // console.log(JSON.stringify(result.ops, undefined, 2))
        
    //     console.log(result.ops[0]._id.getTimestamp());
    // })

    client.close();
});