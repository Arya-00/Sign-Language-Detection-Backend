// Imports
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const chatRouter = require('./routes/chatRoutes');
const cors = require('cors');
// Database
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(express.json());
app.use('/chats', chatRouter);

mongoose.connect(process.env.DB_KEY)
.then(console.log("Database Connected Successfully"))
.catch((err)=>{console.log({"Error": err.message})});

app.listen(port, ()=>{console.log("Server Started on port", port)});