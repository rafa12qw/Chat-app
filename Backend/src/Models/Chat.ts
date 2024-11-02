import { model, Schema } from "mongoose";
import { IChat, IChatMethods, ChatModel } from '../interfaces/IChat';

const chatSchema = new Schema<IChat, ChatModel, IChatMethods>({
    users: [{type: Schema.Types.ObjectId, required:true, ref: 'User'}], 
    messages: [{type: Schema.Types.ObjectId, required:false, ref: 'Message'}],
    nbUsers: {type: Number, required:true},
    nameGroupe: {type: String, required: false},
    avatarGroupe: {type: String, required: false}
})

chatSchema.static('createChat', function createChat(newChat: IChat){
    if(!newChat.nbUsers){
        newChat.nbUsers = 2;
        this.create(newChat);
    }else{
        this.create(newChat);
    }
})

chatSchema.static('getChatById', async function getChatById(id: string){
    const chat = await this.findById(id);
    return chat //it could be null
})


chatSchema.method('addMessage', function addMessage(idMessage: string) {
    if (this.messages){
        this.messages.push(idMessage);
    }else{
        this.messages = [idMessage];
    }
})


const Chat = model<IChat,ChatModel>('Chat',chatSchema);

export default Chat;