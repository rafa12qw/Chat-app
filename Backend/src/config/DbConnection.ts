import dotenv from 'dotenv';
import mongoose, { Connection } from 'mongoose';

dotenv.config();

class DbConnection {
    private uri : string;
    private static connection: Connection;
    private isConnected: boolean;

    constructor(){
        this.uri = process.env.MONGODB_URI || '';
        this.isConnected = false;
    }

    async connect(): Promise<void>{
        if(this.isConnected){
            console.log('You are already connected')
            return;
        }
        try{
            DbConnection.connection = (await mongoose.connect(this.uri)).connection;
            this.isConnected = true;
            console.log('Connected to MongoDB');
        }catch(error){
            console.error('Error Connecting to MongoDB');
        }
    }

    async disconnect():Promise<void>{
        if(!this.isConnected){
            console.log('You are not Connected');
            return;
        }
        try{
            await DbConnection.connection.close();
            this.isConnected = false;
            console.log('disconnected of MongoDB');
        }catch(error){
            console.error('Error Disconnecting to MongoDB');
        }
    }
}