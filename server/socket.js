import { disconnect } from "mongoose";
import { Socket, Server as SocketIOServer } from "socket.io";


const setupSocket = (server) =>{
    const io = new SocketIOServer(server,{
        cors:{
            origin:process.env.ORIGIN,
            methods:["GET","POST"],
            credentials:true,
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) =>{
        console.log(`Client Disconnected : ${socket.id}`);
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }


    io.on("connection",(socket)=>{
        const userId = socket.handshake.query.userId;

        if(userId){
            userSocketMap.set(userId,socket.id);
            console.log(`User connected: ${userId} with socket Id : ${socket.id}`);
        }else{
            console.log("User id not provided during connection.")
        }

        socket.on("disconnect", ()=> disconnect(socket));
    })


};

export default setupSocket;