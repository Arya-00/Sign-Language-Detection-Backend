// Imports
const express = require('express');
const { getChats, addChat, upload } = require('../controllers/chatControls');
const router = express.Router();
const cors = require('cors');


router.use(cors({
    origin: ['https://argo-sign-language-detection.netlify.app', 'https://sign-language-detection-app.netlify.app', "https://sign-language-detection-pwa.netlify.app"],
    credentials: true
}));

router.get('/', getChats);
router.post('/', upload.single('image'), addChat);

module.exports = router;