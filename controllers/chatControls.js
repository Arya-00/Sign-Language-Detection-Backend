const chat_db = require('../models/chatHistorySchema');
const fs = require('fs');
const path = require('path');
const os = require('os');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getChats(req, res) {
    try {
        const chats = await chat_db.find();
        if (chats.length) {
            return res.status(200).json(chats);
        }
        return res.status(200).json({ "Message": "Data not Found" });
    }
    catch (err) {
        return res.status(500).json("Server Error", err);
    }
}

async function addChat(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const newChat = {
            prompt: req.body.prompt,
            image: {
                data: req.file.buffer.toString('base64'),
                contentType: req.file.mimetype
            },
            response: req.body.response,
        }

        const chat = await chat_db.create(newChat);
        const response = await callGemini(req.file.buffer.toString('base64'), req.file.mimetype, req.prompt);
        console.log(response);
        return res.status(201).json({ "Response": response });
    }
    catch (err) {
        return res.status(500).json({ "Request Failed Error": err.message });
    }
}

async function callGemini(data, contentType, prompt) {
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    
    // Convert base64 string to buffer
    const buffer = Buffer.from(data, 'base64');

    // Create a temporary file
    const tempFilePath = path.join(os.tmpdir(), 'temp_image.jpg'); // Adjust the filename and extension as needed
    fs.writeFileSync(tempFilePath, buffer);

    const uploadResult = await fileManager.uploadFile(
        tempFilePath,
        {
            mimeType: contentType,
            displayName: "Sample",
        }
    );

    // View the response.
    console.log(
        `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
    );

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
        `${prompt} + Give result in just the html h3 tag format`,
        {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
            },
        },
    ]);
    fs.unlinkSync(tempFilePath);
    return result.response.text();
}

module.exports = { getChats, addChat, upload };