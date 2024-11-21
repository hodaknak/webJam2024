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

    socket.on("msg", (msg) => {
        let user = socket.id;
        let message = msg.message;
        let datetime = msg.datetime;

        console.log(`${user}: ${message} ${datetime}`);

        // TODO: add message to database
        // TODO: fetch name from database

        let res = {
            name: `whoever ${user} is`,
            message: message,
            datetime: datetime
        };

        io.emit("msg", res);
    })

    socket.on("username", (data) => {
        // TODO: verify username, set username in database
        // TODO: if username is the same as someone else, add a "2" (/other number) after it

        // TODO: error handling

        if (!("username" in data)) {
            // Invalid
            return;
        }
        let processed = "Unnamed User";
        if (data.username.length == 0 || data.username.length > 200) {
            processed = "Unnamed User";
        } else {
            processed = data.username;
        }
        data.username
        console.log(`${socket.id} set their username to ${processed}`)
    })

    socket.on("createGame", (msg) => {
        // Generate the code
        // TODO: check for clashes with the database and regenerate if that is the case
        // TODO: what happens if every code is used up?
        let newGameCode = "";
        for (let i = 0; i < 4; i++) {
            newGameCode += String.fromCharCode(('a'.charCodeAt(0) + Math.floor(Math.random() * 26)))
        }
        console.log(`${socket.id}: creating game of code ${newGameCode}`);
        // TODO: error handling
        // Return the result
        let res = {
            code: newGameCode,
            /*rooms: [
                {
                    name: "A"
                }
            ]*/
        };
        socket.emit("createGame", res);
    })
    
    socket.on("fetchGame", (msg) => {
        // object should have code field

        // TODO: fetch from db
        // TODO: error handling

        let roomCode = msg.code;

        console.log(`${socket.id}: fetching game of code ${roomCode}`);

        // dummy response, actual one will fetch from db
        let res = {
            participants: ["Hodaka's ID", "Caden's ID", "Kyle's ID", "Kelvin's ID", "Green's ID", "Red's ID", "Blue's ID"],
            rooms: [
                {
                    name: "A"
                }
            ]
        };

        socket.emit("fetchGame", res);
    })

    socket.on("fetchRoom", (msg) => {
        // object should have name and code field

        let gameCode = msg.code;

        // TODO: fetch the room name, the participants in the room, and the messages in the room from db (based on the user's socket ID)
        let roomName = "C";

        console.log(`${socket.id}: fetching room of name ${roomName} from game of code ${gameCode}`);

        // TODO: error handling

        // dummy response, actual one will fetch from db
        let res = {
            roomName: roomName,
            participants: ["Hodaka's ID", "Caden's ID", "Kyle's ID", "Kelvin's ID"],
            messages: [
                {
                    name: "Hodaka",
                    message: "hello everyone",
                    datetime: "5:38"
                },
                {
                    name: "Caden",
                    message: "nice to meet you",
                    datetime: "5:39"
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
