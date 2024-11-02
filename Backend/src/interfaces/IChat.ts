import { Document, Model,HydratedDocument } from "mongoose";

interface IChat extends Document{
    users?: string[] //list of ids of users
    messages?: string[] //list of ids of messages
    nbUsers?: number
    nameGroupe?: string
    avatarGroupe?: string
}

interface IChatMethods{
    addMessage(idMessage: string): void;
}

interface ChatModel extends Model<IChat, {}, IChatMethods>{
    
    createChat(users?: string[]): Promise<HydratedDocument<IChat,IChatMethods>>;
    getChatById(id?: string): IChat | null;
    
}

export { IChat, IChatMethods, ChatModel }