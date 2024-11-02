import { model, Schema } from "mongoose";
import { IUser, IUserMethods, UserModel } from "../interfaces/IUser";
import { IChat } from "../interfaces/IChat";
import Chat from './Chat'
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {type: String, required:true},
    password: {type: String, required: true},
    avatar: {type: String, required:false},
    chats: [{type: Schema.Types.ObjectId, ref:'Chat'}]
})

userSchema.static('createUser', function createUser(newUser: IUser){
    return this.create(newUser);
})

userSchema.static('getById', async function getById(id: string){
    const user = await this.findById({id});
    return user // it could be null 
})

userSchema.method('getAllChats', function getAllChats(){
    let res: IChat[] = [];
    if (this.chats){
        for(let chatId of this.chats){
            const chat = Chat.getChatById(chatId);
            if (chat){
                res.push(chat);
            }
        } 
    }
    return res;
})

userSchema.method('putChatInFirst', function(id: string){
    if (!this.chats){
        this.chats = [id];
    }else{
        if(this.chats.includes(id)){
            this.chats.unshift(id);
        }
    }
})
const User = model<IUser,UserModel>('User',userSchema);

export default User;