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
router.post('/api/singUp',userController.singUp);
router.get('/api/singIn', userController.signIn);
router.get('/api/search',userController.getUser);
router.get('/api/getChat',chatController.getAllChatOfUser);
router.get('/api/getMessages', messageController.getMessageOfChatandUser)

export default router