import { Request, Response } from "express";
import UserController from "./userController";
import Chat from "../Models/Chat";
import Message from "../Models/Message";
import User from "../Models/User";

class MessageController{
    private userController: UserController;

    constructor(){
        this.userController = new UserController();
    }
    public async getMessageOfChatandUser(req: Request, res: Response){
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const {idChat} = req.body
        try{
            if(!token){
                res.status(401).json({error: 'Unauthorized missing token'});
            }else{
                const decodeToken = this.userController.decodeToken(token);
                const user = await this.userController.getUserByDecodeToken(decodeToken);
                const chat = await Chat.findById(idChat).populate('messages');

                if(user && chat && chat.messages){
                    const messagePromises = chat.messages.map(async (msg) => {
                        const message = await Message.getMessageById(msg._id);
                        const messageType = message.to.equals(user._id) ? 'to' : 'from';
            
                        // Si el mensaje es "to", también obtenemos el usuario del remitente
                        let avatar = user.avatar;
                        if (messageType === 'to') {
                            const userFrom = await User.getUserById(message.from);
                            avatar = userFrom.avatar;
                        }
            
                        return {
                            avatar,
                            message: message.content,
                            createdAt: message.createdAt,
                            type: messageType,
                        };
                    });
                    const messages = Promise.all(messagePromises);
                    if (messages){
                        res.status(201).json(messages)
                    }else{
                        res.status(404).json({error: 'Messages not found'});
                    }
                }else{
                    res.status(404).json({error: 'Chat not found'});
                }
            }
        }catch(error){
            console.error('Error fetching the messages ', error);
            res.status(501).json({error: 'Internal server error'});
        }
    }
}

export default MessageController;