import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from "http";
import router from "./routes/apiRoutes";
import onConnection from "./routes/socketHandlre";
import DbConnection from "./config/DbConnection";

const app = express();
const server = createServer(app);
const port = 3001;
const dbconnection = new DbConnection();

//Middleware 
app.use(cors());
app.use(express.json());

//Database Connection
dbconnection.connect();
//routes
app.use(router);
//sockets
const io = new Server(server, {cors: {origin: "*"}});
io.on('connection', onConnection)

server.listen(port, ()=> {
    console.log(`Server is running in port ${port}`)
})
export default io;