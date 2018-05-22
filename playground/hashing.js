const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let message = 'I am user number 3';
let hash = SHA256(message).toString();

// JSON WEB TOKEN

    // let data = {
    //     id: 4
    // };

    // let token = {
    //     data,
    //     hash: SHA256(JSON.stringify(data) + 'somesecret').toString() /* somesecret - salt for hash */
    // }

    // token.data.id = 5;
    // token.hash = SHA256(JSON.stringify(token.data)).toString();

    // let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

    // if(resultHash === token.hash){
    //     console.log('GOOD');
    // }else{
    //     console.log('BAD');
    // }

let data = {
    id: 101
};

let token = jwt.sign(data, '123abc');
let decoded = jwt.verify(token, '123abc');

console.log(token);
console.log(decoded);