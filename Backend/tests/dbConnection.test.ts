import mongoose from "mongoose";
import DbConnection from "../src/config/DbConnection";
import { describe, expect, it } from "@jest/globals";




describe('Testing db connection and models funtionalities', () => {
    let dbconnection: DbConnection;
    beforeAll(()=>{
        dbconnection = new DbConnection();
    })
    it('It should connect to the mongoDB database', async() => {
        

        const consoleSpy = jest.spyOn(console, 'log');

        await dbconnection.connect();

        expect(dbconnection.getisConnected()).toBe(true);
        expect(consoleSpy).toHaveBeenLastCalledWith('Connected to MongoDB');
    })
    
    it('It should disconnect to the mongoDB database', async() => {
        
        
        const consoleSpy = jest.spyOn(console, 'log');

        await dbconnection.disconnect();

        expect(consoleSpy).toHaveBeenLastCalledWith("disconnected MongoDB");
        expect(dbconnection.getisConnected()).toBe(false);
    })
})