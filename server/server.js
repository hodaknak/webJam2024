let http = require("http");
const server = http.createServer((req, res) => {
   // handle http requests if needed
});

// Using CommonJS

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

//let Server = require("socket.io");

/*const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});*/

io.on("connection", (socket) => {
    console.log("Connection established");

    // allegedly socket.broadcast can be used to send to all other clients
    // socket.id also seems useful

    /* this was tested endpoint
    socket.on("msg", (msg) => {
        console.log(socket.id + ': ' + msg);
        io.emit("msg", msg);
    });*/

    socket.on("fetchRoom", (msg) => {
        // object should have name and code field

        let roomName = msg.name;
        let roomCode = msg.code;

        console.log(`${socket.id}: ${roomName} ${roomCode}`);


        // dummy response, actual one will fetch from db
        let res = {
            participants: ["Hodaka's ID", "Caden's ID", "Kyle's ID", "Kelvin's ID"],
            messages: [
                {
                    name: "Hodaka's name",
                    message: "hello everyone",
                    datetime: "2024-11-21T05:38:48Z"
                },
                {
                    name: "Caden's ID",
                    message: "nice to meet you",
                    datetime: "2024-11-21T05:39:41Z"
                }
            ]
        };

        socket.emit("fetchRoom", res);
    })

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");//
});

//export default io;
