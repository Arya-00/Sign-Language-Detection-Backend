const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        prompt:
        {
            type: String,
            require: [true, "Prompt is required"],
            trim: true
        },
        image:
        {
            data: {
                type: String,
                require: [true, "Image is required"],
            },
            contentType: {
                type: String,
                required: true,
            }
        },
        response:
        {
            type: String,
            require: [true, "Result is required"],
            trim: true
        }
    }
)

const chat = mongoose.model("chats", chatSchema);
module.exports = chat;