import { describe, expect, it } from "@jest/globals";
import { compare } from "bcrypt";
import request from 'supertest';
import User from "../src/Models/User";
import DbConnection from "../src/config/DbConnection";




const SERVER_URL = "http://localhost:3001";

describe('Test of User Controller class', () => {
    const dbconnection = new DbConnection();
    beforeAll(async () => {
        await dbconnection.connect();
        await User.create({
            username: 'existingUser',
            password: 'hashedPassword'
        })
    })
    afterAll(async () => {
        await User.deleteMany({})
        await dbconnection.disconnect();
    })
    describe('POST/signUp', () => {
        it('Should return with status 400 if the user already exists',async ()=> {
            const response = await request(SERVER_URL)
            .post('/api/signUp')
            .send({username: 'existingUser', password: 'password123'});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({error: 'This user already exists'});
        })
        it('Should return with status 200 and create the user in the database', async () => {
            const response = await request(SERVER_URL)
            .post('/api/signUp')
            .send({username: 'newUser', password: 'password123'});

            const testUser = await User.getUserByUsername('newUser');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(testUser).toBeDefined();
        })
    })
    describe('GET/signIn', () => {
        it('should get 404 if user not found', async () => {
            const response = await request(SERVER_URL)
            .get('/api/signIn')
            .send({username: 'mockUser', password: 'password123'});

            expect(response.status).toBe(404);
            expect(response.body).toEqual({error: "User not found"});
        })
        it('should get 200 if user is found and send the token', async () => {
            const response = await request(SERVER_URL)
            .get('/api/signIn')
            .send({username: 'newUser', password: 'password123'});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        })
        it('should get status 401 if password is not correct', async () => {
            const response = await request(SERVER_URL)
            .get('/api/signIn')
            .send({username: 'newUser', password: 'password1234'});

            expect(response.status).toBe(401);
            expect(response.body).toEqual({error: "Incorrect password"});

        })
    })
    describe('GET/search', () => {
        it('Should get status 200 and send a list with length of the test users', async () => {
            User.createUser({username: "testUser1", password: "hashedPassword"});
            User.createUser({username: "testUser2", password: "hashedPassword" });

            const test1 = await User.getUserByUsername("testUser1");
            const test2 = await User.getUserByUsername("testUser2");
            

            const response = await request(SERVER_URL)
            .get('/api/search')
            .query({term: 'test'});
            if(test1 && test2){
                const cleanUser1 = {"__v": 0,"_id": test1._id.toString(), "chats": [],"password": "hashedPassword","username": "testUser1"}
                const cleanUser2 = {"__v": 0,"_id": test2._id.toString(), "chats": [],"password": "hashedPassword","username": "testUser2"}
                
                expect(response.status).toBe(200);
                expect(response.body).toEqual([cleanUser1, cleanUser2]);
            }
        })
    })
})