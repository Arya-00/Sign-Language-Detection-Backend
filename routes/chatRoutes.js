// Imports
const express = require('express');
const { getChats, addChat, upload } = require('../controllers/chatControls');
const router = express.Router();
const cors = require('cors');


router.use(cors({
    origin: 'https://lovely-unicorn-d1f42b.netlify.app/',
    credentials: true // Allow credentials (cookies)
}));

// router.get('/single/:id', getChatById);
router.get('/', getChats);
router.post('/', upload.single('image'), addChat);

module.exports = router;