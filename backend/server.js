import express from 'express';
import { createServer, maxHeaderSize } from 'node:http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const PORT = 3000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // userId : socketId
let users = []; // { name, pos, color }
let balls = [];
let userScores = [] // {userId , score}

const ballGenerate = () => {
    balls = [];
    const maxWidth = 1300
    const maxHeight = 650
    const colors = ['red','yellow','blue','purple','green']
    const ballCount = Math.floor(Math.random() * 30) + 20
    for(let i=0;i<ballCount;i++){
        const ball = {
            pos:{
                x:Math.floor(Math.random() * maxWidth),
                y:Math.floor(Math.random() * maxHeight) + 50
            },
            color:colors[Math.floor(Math.random() * colors.length)]
        }
        balls.push(ball);
    }   
    

}

ballGenerate();

io.on('connection', (socket) => {
    console.log('user connected ' + socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== "undefined") userSocketMap[userId] = socket.id;

    socket.on('user-details', (data) => {
        const index = users.findIndex(user => user.name === data.name);
        if (index >= 0) {
            users[index] = data;
        } else {
            users.push(data);
        }

        io.emit('other-user-details', users);
        
    });

    socket.on('personal-score',(data)=>{
        const index = userScores.findIndex(user => user.name === data.name);
        if (index >= 0) {
            userScores[index] = data;
        } else {
            userScores.push(data);
        }

        io.emit('users-score',userScores)
    })

    io.emit('users-score',userScores)
    
    io.emit('ball-details',balls)

    socket.on('ball-change',(data)=>{
        balls = data
        if(balls.length === 0){
            io.emit('game-over',true)
            userScores = []
            users = []
            ballGenerate()
        }
        io.emit('ball-details',balls)
    })



    socket.on('disconnect', () => {
        console.log("user disconnected: " + socket.id);
        
        const index = users.findIndex(user => userSocketMap[user.name] === socket.id);
        if (index >= 0) {
            users.splice(index, 1);
            userScores.splice(index,1)
        }
        delete userSocketMap[userId];
        // Emit updated user list to all clients
        io.emit('other-user-details', users);
    });
});

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}



server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
