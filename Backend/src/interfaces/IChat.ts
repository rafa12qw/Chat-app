import {  Model,HydratedDocument } from "mongoose";
import { Types } from "mongoose";
interface IChat{
    users: Types.ObjectId[] //list of ids of users
    messages?: Types.ObjectId[] //list of ids of messages
    nbUsers?: number
    nameGroupe?: string
    avatarGroupe?: string
}

interface IChatMethods{
    addMessage(idMessage: Types.ObjectId): void;
}

interface ChatModel extends Model<IChat, {}, IChatMethods>{
    getAllChatsOfUser(idUser: Types.ObjectId): Promise<HydratedDocument<IChat,IChatMethods>[]>;
    getAllChatOfUser(idUser: Types.ObjectId): Promise<HydratedDocument<IChat,IChatMethods>[]>;
    createChat(newChat: IChat): Promise<HydratedDocument<IChat,IChatMethods>>;
    getChatById(id: Types.ObjectId): Promise<HydratedDocument<IChat,IChatMethods>>;
    getChatByUsers(idUser1: Types.ObjectId, idUser2: Types.ObjectId): Promise<HydratedDocument<IChat,IChatMethods>>;
}

export { IChat, IChatMethods, ChatModel }