import { HydratedDocument } from "mongoose";
import { Document, Model } from "mongoose";

interface IMessage extends Document{
    from?: string //id of user that send the message
    to?: string //id of user that send the message
    content: string
    createdAt: Date
}

interface MessageModel extends Model<IMessage>{
    createMessage(newMessage: IMessage): Promise<HydratedDocument<IMessage>>;
    getMessageById(idMessage: string): IMessage | null;
}

export { IMessage, MessageModel }