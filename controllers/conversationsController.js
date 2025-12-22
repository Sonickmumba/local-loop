const pool = require("../config/db");
const { generateId } = require("../utils/helpers");



// Get user's conversations
exports.getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
        c.*,
        l.title AS listing_title,

        CASE 
          WHEN c.participant1_id = $1 THEN u2.name
          ELSE u1.name
        END AS partner_name,

        CASE 
          WHEN c.participant1_id = $1 THEN c.participant2_id
          ELSE c.participant1_id
        END AS partner_id,

        (
          SELECT m.content
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message,

        (
          SELECT COUNT(*)
          FROM messages m
          WHERE m.conversation_id = c.id
            AND m.sender_id <> $1
            AND m.is_read = FALSE
        ) AS unread_count

      FROM conversations c
      JOIN listings l ON c.listing_id = l.id
      JOIN users u1 ON c.participant1_id = u1.id
      JOIN users u2 ON c.participant2_id = u2.id
      WHERE c.participant1_id = $1
         OR c.participant2_id = $1
      ORDER BY c.last_message_at DESC
      `,
      [userId]
    );

    const conversations = result.rows;

    // add timeAgo key to each conversation
    conversations.forEach(conv => {
      conv.timeAgo = conv.last_message_at
        ? timeAgo(conv.last_message_at)
        : '';
    });

    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};


// get or create conversation
exports.getOrCreateConversation = async (req, res, next) => {
    try {
        const { listingId, participantId } = req.body;
        const userId = req.user.id;

        if (userId === participantId) {
            return res.status(400).json( {success: false, message: "Cannot create conversation with yourself!"});
        }

        // check if conversation already exist
        const conversationResult = await pool.query(`SELECT * FROM conversations WHERE listing_id = $1 AND ((participant1_id = $2 AND participant2_id = $3) OR (participant1_id = $4 AND participant2_id = $5))`, [listingId, userId, participantId, participantId, userId]);
        const conversation = conversationResult.rows;

        if (conversation.length > 0) {
            return res.json( {success: true, data: conversation[0]});
        }

        // create new conversion
        const conversionId = generateId();
        await pool.query(`INSERT INTO conversations (id, listing_id, participant1_id, participant2_id) VALUES ($1, $2, $3, $4)`, [conversionId, listingId, userId, participantId]);

        const newConversion = await pool.query(`SELECT * FROM conversations WHERE id = $1`, [conversionId]);

        res.status(201).json( {
            success: true,
            message: "Conversation created successfully",
            data: newConversion[0]
        })
    } catch (error) {
        next(error);
    }
}
