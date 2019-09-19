const assert = require('assert');

const server = require('./server');
const db = require('./db/db');
const supertest = require('supertest');

describe('Backend', function() {
    let app;
    
    let userInformation = {
        username: "testuserX123",
        password: "a1B2c3DD4aS"
    };
    
    //Set up the server
    before(async function() {
        app = await server.runServer({
            port: 32767,
            db: {
                fileName: ":memory:"
            }
        });
    });
    
    //Define backend tests
    describe('Users', function() {
        it(`should create a new user (${userInformation.username})`, async function() {
            let res = await supertest(app).post("/api/users/create").set('Content-Type', 'application/json')
                .send({
                    username: userInformation.username,
                    password: userInformation.password
                })
                .expect(200);
            
            let users = await db.select("Users", ["*"], "username = ?", [userInformation.username]);
            assert.strictEqual(users.length, 1, "User not found");
            userInformation.token = res.body.token;
        });
        
        it('should return a token that corresponds to the current user', async function() {
            let res = await supertest(app).post("/api/users/getToken").set('Content-Type', 'application/json')
                .send({
                    username: userInformation.username,
                    password: userInformation.password
                })
                .expect(200);
                
            let users = await db.select("Users, Tokens", ["*"], "tokens.userId = Users.id AND username = ? AND token = ? AND tokens.userId = ?", [userInformation.username, res.body.token, res.body.id]);
            assert.strictEqual(users.length, 1, "User not found");
        })
        
        it(`should return the correct username (${userInformation.username})`, async function() {
            let res = await supertest(app).get("/api/users/whoami").set('Content-Type', 'application/json')
                .set('Authorization', 'Token ' + userInformation.token)
                .expect(200);
            
            assert.strictEqual(res.body.username, userInformation.username, "User return value not as expected");
        });
    });
    
    describe('User errors', function() {
        it('should fail to return any user information with 401 Unauthorized', async function() {
            await supertest(app).get("/api/users/whoami").set('Content-Type', 'application/json')
                .set('Authorization', 'Token 05f23a40e8a97251d69397da6f7e49489252e85981be0c391f64c22241b6ef14d12fef0f360d0366929c2bc4caf06916b833dd21daebc8c279be691fa4e7eb9f')
                .expect(401);
        })
    })
});