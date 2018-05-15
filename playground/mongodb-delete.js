const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    if(err){
        return console.log('Unable to connect to database.'); /* return is used to prevent further execution of programm if err exists */
    }
    
    let db = client.db('TodoApp')

    console.log('Connected to MongoDb server');

    // deleteMany
        // db.collection('Todos')
        //     .deleteMany({text: 'Eat lunch'})
        //     .then((result)=>{
        //         console.log(result);
        //     })
        //     .catch((err)=>{
        //         console.log(err);
        //     })

    //deleteOne
        // db.collection('Todos')
        //     .deleteOne({text: 'Eat lunch'})
        //     .then((result)=>{
        //         console.log(result);
        //     })
        //     .catch((err)=>{
        //         console.log(err);
        //     })

    //findOneAndDelete - deletes and returns the deleted document
    db.collection('Todos')
        .findOneAndDelete({text: 'Eat lunch'})
        .then((result)=>{
            console.log(result);
        })
        .catch((err)=>{
            console.log(err);
        })

    client.close();
});