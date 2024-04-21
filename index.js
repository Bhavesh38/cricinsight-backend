import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import indexRouter from "./routes/indexRoutes.js"
import { Server } from "socket.io";
import http from 'http';

const app = express();
dotenv.config();
const server = http.createServer(app);
export const io = new Server(server);


// Middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api", indexRouter);

// Connect to MongoDB
const uri ='mongodb+srv://bhaveshconnect38:IeKuFIjlvRBXoiww@MONGODB_URI=cluster0.odjspme.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri)

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
