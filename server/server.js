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

    // LIST OF QUERIES

    // These 6 are ran with db.run(). Here is a sample query with the error logging
    /*db.run(insertGameQuery,data,(err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Game Inserted");
    }*/
        const insertGameQuery = "INSERT INTO Game(GameCode, Host, Messages, GameState) VALUES(?, ?, ?, ?)"
        const insertUserQuery = "INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)"
        const insertRoomQuery = "INSERT INTO rooms (RoomID,GameCode) Values(?,?)";
        const removeGameQuery = "DELETE FROM Game WHERE GameCode = ?";
        const removeUserQuery = "DELETE FROM Users WHERE id = ?"
        const removeRoomQuery = "DELETE FROM rooms WHERE RoomID = ? AND GameCode = ?"
    
        // These 3 are ran with db.all(). Here is a sample query with the error logging
        /*db.all(selectRoomQuery,data,(err,rows) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Query result: ", rows);
          })*/
        const selectGameQuery = "SELECT * FROM Game where GameCode = ?"
        const selectUserQuery = "SELECT * FROM Users where id = ?"
        const selectRoomQuery = "SELECT * FROM rooms where RoomID = ? AND GameCode = ?"
        

    socket.on("fetchRoom", (msg) => {
        console.log(`${socket.id}: ${msg.command} ${msg.roomcode} ${msg.gamecode}`);
        if(msg.command === "find room") {
            const data = [msg.roomcode,msg.gamecode]
            db.all(selectRoomQuery,data,(err,rows) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log("Query result: ", rows);
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