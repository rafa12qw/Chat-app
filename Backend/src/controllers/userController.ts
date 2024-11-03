import  User  from '../Models/User'
import dotenv from "dotenv"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { IUser } from '../interfaces/IUser';
import { Request, Response } from 'express';

dotenv.config();

class UserController{
    private userService: typeof User;

    constructor(userService: typeof User){
        this.userService = userService
    }


    public generateToken(_id: string, username: string): string {
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
    //post
    public async singUp(req:Request, res:Response): Promise<void>{
        const{ username, password } = req.body;
        try{
            const existingUser: IUser | null = this.userService.getUserByUsername(username);
            
            if(existingUser){
                res.status(400).json({error: "This user already exists"})
            }
            
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = await this.userService.createUser({
                username,
                password: hashedPassword
            })
            
            const token = this.generateToken(newUser._id.toString(), newUser.username);
            res.status(200).json({token});
        }catch(error){
            console.error('Error finding the user in the database', error);
            res.status(500).json({error: "Internal error in the server"});
        }
    }

    public async signIn(req: Request, res: Response): Promise<void>{
        const {username, password} = req.body;
        try {
            const findedUser = this.userService.getUserByUsername(username);
            
            if (!findedUser){
                res.status(404).json({error: "User not finded"})
            }else{

                //compare the hashed password with the password in the database
                const comparisonResult = await bcrypt.compare(password, findedUser.password)
                
                if(comparisonResult){
                    const token = this.generateToken(findedUser._id.toString(), username)
                    res.status(200).json({token})
                }else{
                    res.status(401).json({error: "Incorrect password"})
                }
            }
        }catch(error){
            console.log('Error finding the user in the database ',error);
            res.status(500).json({error: 'internal error in the server'})
        }
    }
}

export default UserController;