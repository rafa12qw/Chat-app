import { model, Schema, Types } from "mongoose";
import { IUser, IUserMethods, UserModel } from "../interfaces/IUser";
import { IChat } from "../interfaces/IChat";
import Chat from './Chat'
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {type: String, required:true},
    password: {type: String, required: true},
    avatar: {type: String, required:false},
    chats: [{type: Schema.Types.ObjectId, ref:'Chat'}],
    socketId: {type: String, required: false}
})

userSchema.static('createUser',function createUser(newUser: IUser){
    return this.create(newUser);
})

userSchema.static('getById', async function getById(id: string){
    const user = await this.findById({id});
    return user // it could be null 
})

userSchema.static('getUserByUsername', async function getUserByUsername(username){
    const user = await this.findOne({username})
    return user
})

userSchema.static('getUserBySearch', async function getUserBySearch(searchTerm){
    const user = await this.find({username: { $regex: searchTerm, $options: 'i' }})
    return user;
})

userSchema.static('getUsersOfGroupChat', async function getUsersOfGroupChat(idChat: Types.ObjectId){
    const users = await this.find({chats: {$in: idChat}});
    return users;
})

userSchema.method('putChatInFirst', function(id){
    if (!this.chats){
        this.chats = [id];
    }else{
        if(this.chats.includes(id)){
            this.chats.unshift(id);
        }
    }
    this.save();
})

userSchema.method('putNewChat', function putNewChat(idNewChat){
    if(!this.chats){
        this.chats = [idNewChat];
    }else{
        if(!this.chats.includes(idNewChat)){
            this.chats.push(idNewChat);
        }
    }
    this.save()
})

userSchema.method('putSocketID', function putSocketID(socketId){
    this.socketId = socketId;
})
const User = model<IUser,UserModel>('User',userSchema);

export default User;