import Fetch from './react/src/fetch';
var faker = require('faker');

const numOfAccounts = 5;


// generates accounts on the server for testing purposes 



// create the accounts 

function createFakeData(){
    let name = faker.name.firstName();
    let password = faker.commerce.color();
}

function addtoAccounts(numOfAccounts){
    for(let i = 0; i < numOfAccounts; ++i){
        let someone = createFakeData();
        accounts.push(someone);
    }
}



