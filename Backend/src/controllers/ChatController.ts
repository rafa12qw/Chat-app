import Chat from "../models/Chat";
import User from "../models/User";
import UserController from "./UserController";
import Message from "../models/Message";
import { Socket } from "socket.io";
import { Request, Response } from "express";
import { Types } from "mongoose";
class ChatController {
    private userController: UserController;
    constructor(){
        this.userController = new UserController();
    }
    
    public async getAllChatOfUser(req: Request, res: Response){
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        try{
            if(!token){
                res.status(401).json({ error: 'Unauthorized missing token'});
            }else{
                const decodeToken = this.userController.decodeToken(token);

                const user = await this.userController.getUserByDecodeToken(decodeToken);

                if(user){
                    let response: {
                        _id: Types.ObjectId;
                        avatar: string | undefined;
                        name: string | undefined;
                        type: string;
                    }[] = []; //here we stock the response of the api
                    const chats = await Chat.getAllChatsOfUser(user._id);
                    if (!chats) {
                        res.status(404).json({error : 'Not chats founded'});
                    }else{
                        for (let chat of chats){
                            if (chat.nbUsers && chat.nbUsers > 2){
                                response.push({
                                    _id: chat._id,
                                    avatar: chat.avatarGroupe,
                                    name: chat.nameGroupe,
                                    type: 'groupe'
                                })
                            }else{
                                //if the chat is only of 2 people we stock the other user information
                                const idUser = chat.users.find((id) => !id.equals(user._id))
                                const userChat = await User.getUserById(idUser);
                                response.push({
                                    _id: chat._id,
                                    avatar: userChat.avatar,
                                    name: userChat.username,
                                    type: 'user'
                                })
                            }
                        }
                        res.status(201).json(response);
                    }
                }
            }
        }catch(error){
            console.error('Error getting chats of User ', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }
    public async sendMessageToUser(socket: Socket, data: any){
        try{
            const {token, usernameTo, contentMessage} = data;
    
            const decodeToken = this.userController.decodeToken(token);
    
            const userFrom = await this.userController.getUserByDecodeToken(decodeToken);
            const userTo = await User.getUserByUsername(usernameTo);
            
            if (userFrom && userTo){

                let chat = await Chat.getChatByUsers(userFrom._id, userFrom._id,);
                let message;
                if(chat){
                    message = await Message.createMessage({
                        from:userFrom._id,
                        to: chat._id,
                        content: contentMessage
                    })
                    chat.addMessage(message._id);
                    userFrom.putChatFirst(chat._id);
                    userTo.putChatFirst(chat._id);
                }else{
                    chat = await Chat.createChat({
                        users: [userFrom._id, userTo._id]
                    })
                    message = await Message.createMessage({
                        from:userFrom._id,
                        to: chat._id,
                        content: contentMessage
                    })
                    chat.addMessage(message._id);
                    userFrom.putNewChat(chat._id);
                    userFrom.putNewChat(chat._id);
                }
                if(userTo.socketId){
                    socket.broadcast.to(chat._id.toString()).emit(
                        'receivedMessage',{
                            avatar: userFrom.avatar,
                            username: userFrom.username,
                            message: message.content,
                            createdAt: message.createdAt,
                            type: 'to'
                        }
                    )
                }
                socket.emit(
                    'sendMessage',{
                        avatar: userFrom.avatar,
                        username: userFrom.username,
                        message: message.content,
                        createdAt: message.createdAt,
                        type: 'from'
                    }
                )
            }


        }catch(error){
            console.error('Error sending message ', error);
            socket.emit('error', {error: 'Internal server error'});
        }
    }

    public async sendMessageToGroupe(socket: Socket, data: any){
        try{
            const {token, chatTo, contentMessage} = data;
        }
    }
}


export default ChatController;