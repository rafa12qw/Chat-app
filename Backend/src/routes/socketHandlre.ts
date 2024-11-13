import io from '../server'
import UserController from '../controllers/UserController'
import { Socket } from 'socket.io';
const userController = new UserController();
const onConnection = (socket: Socket) =>{
    socket.on('register', (data) => {
        
    })
}