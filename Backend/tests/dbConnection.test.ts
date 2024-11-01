import DbConnection from "../src/config/DbConnection";
import { describe, expect, it } from "@jest/globals";


describe('Testing db connection and models funtionalities', () => {
    let dbconnection: DbConnection;
    beforeAll(()=>{
        dbconnection = new DbConnection();
    })
    it('It should connect to the mongoDB database', async() => {
        try{
            
        }
    })
})