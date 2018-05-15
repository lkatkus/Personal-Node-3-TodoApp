const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    if(err){
        return console.log('Unable to connect to database.'); /* return is used to prevent further execution of programm if err exists */
    }
    
    let db = client.db('TodoApp')

    console.log('Connected to MongoDb server');

    // db.collection('Todos')
    //     .find()
    //     .toArray()
    //     .then((docs) => {
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })

    // db.collection('Todos')
    //     .find({_id: new ObjectID('5afad85d6a96ab18d3b371e0') })
    //     .toArray()
    //     .then((docs) => {
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     })

    db.collection('Todos')
        .find()
        .count()
        .then((count) => {
            console.log(`Todos count: ${count}`);
        })
        .catch((err) => {
            console.log(err);
        })

    client.close();
});