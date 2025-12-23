const pool = require('../config/db');


exports.getUserNotifications = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { unreadOnly } = req.query;

        let query = `SELECT * FROM notifications WHERE user_id = $1`;
        const params = [userId];

        if (unreadOnly === 'true') {
            query += ` AND is_read = false`;
        }

        query += ` ORDER BY created_at DESC LIMIT 50`;

        const notificationsResult = await pool.query(query, params);

        const { rows } = await pool.query(query, params);

        
        const notifications = rows.map(notif => ({
            ...notif,
            timeAgo: timeAgo(notif.created_at)
        }));

        res.json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
}