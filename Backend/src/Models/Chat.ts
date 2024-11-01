import { model, Schema } from "mongoose";
import { IChat, IChatMethods, ChatModel } from '../interfaces/IChat';

const chatSchema = new Schema<IChat, ChatModel, IChatMethods>({
    users: [{type: Schema.Types.ObjectId, required:true, ref: 'User'}], 
    messages: [{type: Schema.Types.ObjectId, required:false, ref: 'Message'}],
    nbUsers: {type: Number, required:true},
    nameGroupe: {type: String, required: false},
    avatarGroupe: {type: String, required: false}
})

