// const Message = require("../models/Message")

// exports.getRoomMessages = async (req, res) => {
//     const messages = await Message.find({ room: req.params.roomId })
//     .populate('sender', 'username')
//     .sort({ createdAt: 1 })

//     res.json(messages);


// }
const Message = require("../models/Message")

exports.getRoomMessages = async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.roomId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}