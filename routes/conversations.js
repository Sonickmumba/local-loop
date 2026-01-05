const express = require('express');
const authMiddleware = require('../middleware/auth');
const conversationsController = require('../controllers/conversationsController');

const router = express.Router();

// protect all routes
router.use(authMiddleware);

// GET /api/conversations` - Get user's conversations
router.get('/', conversationsController.getUserConversations);

// POST /api/conversations - Get or create conversation
router.post('/', conversationsController.getOrCreateConversation);

// POST /api/conversations/messages` - Send message
router.post('/messages', conversationsController.sendMessage);

router.get(
  '/:conversationId',
  authMiddleware,
  conversationsController.getConversationById
);

// GET /api/conversations/:chatId/messages - Get messages in conversations
router.get('/:chatId/messages', conversationsController.getMessages);

module.exports = router;
