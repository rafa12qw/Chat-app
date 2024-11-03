import { HydratedDocument, Model } from "mongoose";
import { IChat } from "./IChat";

interface IUser{
    username: string,
    password: string,
    avatar?: string,
    chats?: string[] //string of ids of chats that the users participates
}

interface IUserMethods{

    getAllChats(): IChat[];
    putChatFirst(id?: string): void;
}

interface UserModel extends Model<IUser, {},IUserMethods>{

    createUser(newUser: IUser): Promise<HydratedDocument<IUser,IUserMethods>>;
    getUserById(id?: string): HydratedDocument<IUser,IUserMethods> | null;
    getUserByUsername(username: string): HydratedDocument<IUser,IUserMethods> | null;
    
}

export { IUser, IUserMethods, UserModel};