import UserController from '../controllers/userController'
import { Socket } from 'socket.io';
import ChatController from '../controllers/ChatController';
const userController = new UserController();
const chatController = new ChatController();
const onConnection = (socket: Socket) =>{
    socket.on('registration', userController.socketRegistration);
    socket.on('sendMessagetoUser', chatController.sendMessageToUser);
    socket.on('sendMessagetoGroup', chatController.sendMessageToGroupe);
}

export default onConnection