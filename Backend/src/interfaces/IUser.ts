import { HydratedDocument, Model, Types} from "mongoose";
import { IChat } from "./IChat";
interface IUser{
    username: string,
    password: string,
    avatar?: string,
    chats?: Types.ObjectId[] //string of ids of chats that the users participates
    socketId?: string
}

interface IUserMethods{
    putChatFirst(id?: Types.ObjectId): void;
    putNewChat(idNewChat: Types.ObjectId): void;
    putSocketID(socketId: string): void;
}

interface UserModel extends Model<IUser, {},IUserMethods>{
    getUsersFromUser(ids?: Types.ObjectId): Promise<HydratedDocument<IUser,IUserMethods>[]>;
    createUser(newUser: IUser): Promise<HydratedDocument<IUser,IUserMethods>>;
    getUserById(id?: Types.ObjectId): Promise<HydratedDocument<IUser,IUserMethods>>;
    getUserByUsername(username: string): Promise<HydratedDocument<IUser,IUserMethods>>;
    getUserBySearch(searchTerm: any):  Promise<HydratedDocument<IUser,IUserMethods>[]>;
}

export { IUser, IUserMethods, UserModel};