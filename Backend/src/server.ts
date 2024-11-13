import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from "http";
import router from "./routes/apiRoutes";
import onConnection from "./routes/socketHandlre";
 
const app = express();
const server = createServer(app);
const port = 3001;


//Middleware 
app.use(cors());
app.use(express.json());


app.use('/',router);
const io = new Server(server, {cors: {origin: "*"}});
io.on('connection', onConnection)
server.listen(port, ()=> {
    console.log(`Server is running in port ${port}`)
})
export default io;