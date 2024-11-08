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

chatSchema.static('getChatById', async function getChatById(id){
    const chat = await this.findById(id);
    return chat //it could be null
})

chatSchema.static('getAllChatOfUser', async function getAllChatOfUser(idUser){
    const chat = await this.find({users: idUser}).select('users');
    return chat
})
chatSchema.static('getChatByUsers', async function getChatByUsers(idUser1, idUser2){
    const chat = await this.findOne({users: {$all: [idUser1, idUser2]}});
    return chat
})
chatSchema.method('addMessage', function addMessage(idMessage) {
    if (this.messages){
        this.messages.push(idMessage);
    }else{
        this.messages = [idMessage];
    }
    this.save();
})


const Chat = model<IChat,ChatModel>('Chat',chatSchema);

export default Chat;