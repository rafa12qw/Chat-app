import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from "http";

const app = express();
const server = createServer(app);
const port = 3001;


//Middleware 
app.use(cors());
app.use(express.json());


app.get('/',(req,res) => {
    res.status(200).send('Server is running')
})
const io = new Server(server, {cors: {origin: "*"}});
io.on('connection', (socket) => {
})
export default io;
server.listen(port, ()=> {
    console.log(`Server is running in port ${port}`)
})