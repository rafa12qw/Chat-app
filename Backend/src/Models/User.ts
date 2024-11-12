import { model, Schema } from "mongoose";
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

userSchema.static('getByUsername', async function getByUsername(username){
    const user = await this.findOne({username})
    return user
})

userSchema.static('getBySearch', async function getBySearch(searchTerm){
    const user = await this.findOne({username: { $regex: searchTerm, $options: 'i' }})
    return user;
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