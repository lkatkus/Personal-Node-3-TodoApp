const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    if(err){
        return console.log('Unable to connect to database.'); /* return is used to prevent further execution of programm if err exists */
    }
    
    let db = client.db('TodoApp')

    console.log('Connected to MongoDb server');

    db.collection('Todos')
        .findOneAndUpdate(
            {_id:new ObjectID("5afad85d6a96ab18d3b371e0")}, /* filter argument */
            { $set: {
                completed: true
            }},
            { returnOriginal: false }
        )
        .then((result)=>{
            console.log(result);
        })
        .catch((err)=>{
            console.log(err);
        })

    client.close();
});