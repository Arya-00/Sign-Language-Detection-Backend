// Imports
const express = require('express');
const { getChats, addChat, upload } = require('../controllers/chatControls');
const router = express.Router();
const cors = require('cors');


router.use(cors({
    origin: 'http://localhost:4200',
    credentials: true // Allow credentials (cookies)
}));

// router.get('/single/:id', getChatById);
router.get('/', getChats);
router.post('/', upload.single('image'), addChat);

module.exports = router;