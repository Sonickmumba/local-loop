const express = require("express");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

// protect all routes
router.use(authMiddleware);

// GET /api/conversations` - Get user's conversations
router.get("/", conversationsController.getUsersConversations);

// POST /api/conversations - Get or create conversation
router.post("/", conversationsController.getOrCreateConversation);

// POST /api/conversations/messages` - Send message
router.post('/messages', conversationsController.sendMessage);

// GET /api/conversations/:conversationId/messages - Get messages in conversations
router.get(":conversationId/messages", conversationsController.getMessages);



module.exports = router;