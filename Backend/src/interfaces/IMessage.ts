import { HydratedDocument, Types } from "mongoose";
import { Document, Model } from "mongoose";

interface IMessage{
    from: Types.ObjectId //id of user that send the message
    to: Types.ObjectId //id of user that send the message
    content: string
    createdAt?: Date
}

interface MessageModel extends Model<IMessage>{
    createMessage(newMessage: IMessage): Promise<HydratedDocument<IMessage>>;
    getMessageById(idMessage: Types.ObjectId): IMessage | null;
}

export { IMessage, MessageModel }