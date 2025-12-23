const express = require('express');
const authMiddleware = require('../middleware/auth');
const notificationsController = require('../controllers/notificationsController');



const router = express.Router();

// since all routes are protected we do
// router.use(authMiddleware);




// - `GET /api/notifications` - Get notifications (protected)
router.get('/', notificationsController.getUserNotifications);

// - `GET /api/notifications/unread-count` - Get unread count (protected)
router.get('/unread-count', notificationsController.getUnreadCount);

// - `PATCH /api/notifications/:id/read` - Mark as read (protected)
router.patch('/:id/read', notificationsController.markAsRead);

// - `PATCH /api/notifications/read-all` - Mark all as read (protected)
router.patch('/read-all', notificationsController.markAllAsRead);

// - `DELETE /api/notifications/:id` - Delete notification (protected)
router.delete('/:id', notificationsController.deleteNotification);