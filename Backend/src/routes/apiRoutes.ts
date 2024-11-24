import { Router } from "express";
import UserController from "../controllers/userController";
import ChatController from "../controllers/ChatController";
import MessageController from "../controllers/MessageController";

const userController = new UserController();
const chatController = new ChatController();
const messageController = new MessageController();

const router = Router();

router.get('/',(req,res) => {  
    res.status(200).send('Server is running')
});
router.post('/api/signUp',userController.signUp.bind(userController));
router.get('/api/signIn', userController.signIn.bind(userController));
router.get('/api/search',userController.getUser.bind(userController));
router.get('/api/getChat',chatController.getAllChatOfUser.bind(chatController));
router.get('/api/getMessages', messageController.getMessageOfChatandUser.bind(chatController))

export default router