import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import setupSocket from "./sockets";
import connectDB from "./utils/connectDb";
import userRouter from "./routes/user.routes";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

connectDB();

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello, this is the user management server!</h1>");
});

app.use("/api/v1/user", userRouter);

setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
