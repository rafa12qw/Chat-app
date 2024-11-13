import  User  from '../Models/User'
import dotenv from "dotenv"
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { IUser } from '../interfaces/IUser';
import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import ChatController from './ChatController';
import Chat from '../Models/Chat';
import Message from '../Models/Message';
import { Types } from 'mongoose';

dotenv.config();

class UserController{
    public generateToken(_id: Types.ObjectId, username: string): string {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not defined in the environment variables.");
        }
        return jwt.sign(
            { _id, username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '8h' }
        );
    }
    
    public decodeToken(token: string){
        try{
            if (!process.env.JWT_SECRET_KEY) {
                throw new Error("JWT_SECRET_KEY is not defined in the environment variables.");
            }
            const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY);
            return decoded
        }catch(error){
            console.error('Error verifying token: ', error);
            return null;
        }
    }
    
    public async getUserByDecodeToken(decodeToken: any){
        try{

            if (decodeToken && typeof decodeToken !== 'string' && 'username' in decodeToken) {
                const username = decodeToken.username;
                const user = await User.getUserByUsername(username);
                return user
            }else{
                return null
            }
        }catch(error){
            console.error("Error getting decoded user ", error);
        }
    }
    //post
    public async singUp(req:Request, res:Response): Promise<void>{
        const{ username, password } = req.body;
        try{
            const existingUser = await User.getUserByUsername(username);
            
            if(existingUser){
                res.status(400).json({error: "This user already exists"})
            }
            
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = await User.createUser({
                username,
                password: hashedPassword
            })
            
            const token = this.generateToken(newUser._id, newUser.username);
            res.status(200).json({token});
        }catch(error){
            console.error('Error finding the user in the database', error);
            res.status(500).json({error: "Internal error in the server"});
        }
    }

    public async signIn(req: Request, res: Response): Promise<void>{
        const {username, password} = req.body;
        try {
            const findedUser = await User.getUserByUsername(username);
            
            if (!findedUser){
                res.status(404).json({error: "User not finded"});
            }else{

                //compare the hashed password with the password in the database
                const comparisonResult = await bcrypt.compare(password, findedUser.password);
                
                if(comparisonResult){
                    const token = this.generateToken(findedUser._id, username);
                    res.status(200).json({token});
                }else{
                    res.status(401).json({error: "Incorrect password"});
                }
            }
        }catch(error){
            console.log('Error finding the user in the database ',error);
            res.status(500).json({error: 'internal error in the server'});
        }
    }
    public async getUser(req: Request, res: Response){
        const searchTerm = req.query.term;

        try{
            if (searchTerm){
                const users = await User.getUserBySearch(searchTerm);
                if (users.length > 0){
                    res.status(200).json(users);
                }else{
                    res.status(404).json({error: 'Not users finded'});
                }
            }
        }catch(error){
            console.log('Error searching users ', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
    public async socketRegistration(socket:Socket, data: any){
        try{

            const { token } = data;
            const decodeToken = this.decodeToken(token);
    
            const user = await this.getUserByDecodeToken(decodeToken);
            if (user){
                user.socketId = socket.id;
                user.save();
                if (user.chats){
                    for(let chat of user.chats){
                        socket.join(chat.toString())
                    }
                }
            }
        }catch(error){
            console.error("Error in socket registration ",error);
        }
        
    }

    
}

export default UserController;