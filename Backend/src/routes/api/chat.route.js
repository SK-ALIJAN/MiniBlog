const router = require("express").Router();
const chatController = require("../../controllers/api/chat.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../public/uploads/chats/file");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Extract file extension
        cb(null, `${Date.now()}${ext}`); // Generate unique filename
    },
});

const upload = multer({ storage });

router.post("/session", chatController.createChatSession)
router.post("/:session_id", upload.single("file"), chatController.sendMessage)
router.get("/:session_id", chatController.fetchMessages)
router.get("/verify-session/:sessionId", chatController.checkForSessionExistance)

module.exports = router;