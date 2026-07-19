import { Router } from "express"
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/AuthMiddlewares.js";
import ChatGroupController from "../controllers/ChatGroupController.js";
import ChatGroupUserController from "../controllers/ChatGroupUserController.js";
import ChatsController from "../controllers/ChatsController.js";
import uploadRoutes from "./upload.js";
const router=Router();

// auth routes
router.post('/auth/login', AuthController.login);


//chat group routes
router.post('/chat-group', authMiddleware, ChatGroupController.store);
router.get('/chat-group', authMiddleware, ChatGroupController.index);
router.get('/chat-group/:id', ChatGroupController.show);
router.put('/chat-group/:id', authMiddleware, ChatGroupController.update);
router.delete('/chat-group/:id', authMiddleware, ChatGroupController.destroy);


//caht  groups
router.get('/chat-group-users', ChatGroupUserController.index);
router.post('/chat-group-users', ChatGroupUserController.store);

//chats messages
router.get('/chats/:groupId', ChatsController.index);

// file upload (Cloudinary)
router.use('/upload', uploadRoutes);

export default router;