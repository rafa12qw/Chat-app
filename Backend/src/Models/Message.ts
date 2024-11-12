import { model, Schema } from "mongoose";
import { IMessage, MessageModel } from "../interfaces/IMessage";

const messageSchema = new Schema<IMessage, MessageModel>({
    from: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},
    content: {type: String,required: true},
    createdAt: {type: Date, default:Date.now}
})

messageSchema.static('createMessage', function createMessage(newMessage: IMessage){
    return this.create(newMessage);
})

messageSchema.static('getMessageById', async function getMessageById(idMessage: string){
    const message = await this.findById(idMessage);
    return message
})

const Message = model<IMessage, MessageModel>('Message', messageSchema);

export default Message