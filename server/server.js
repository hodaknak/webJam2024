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
        console.log(`${socket.id}: ${msg.command} ${msg.name} ${msg}`);
        if(msg.command === "create room") {
            const insertRoomQuery = "INSERT INTO rooms (RoomID,GameCode) Values(?,?)";
            const data = [msg.name,msg.code]
            console.log("I made it here")
            db.run(insertRoomQuery,data,(err) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log("Inserted into Rooms Table");
              })
        }

    })

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");//
});

//export default io;



const sqlite3 = require("sqlite3").verbose();

// Creating or connecting to db
const db = new sqlite3.Database(
  "./collection.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);