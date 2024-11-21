import http from "http";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";

const server = http.createServer((req, res) => {
   // handle http requests if needed
});

const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Connection established");

    // allegedly socket.broadcast can be used to send to all other clients
    // socket.id also seems useful

    socket.on("msg", (msg) => {
        if(msg === "create room") {
            const data = [
                "1000",
                "",
                "",
                socket.id,
                "",
                "Waiting"
            ]
            const insertSql = `SELECT * FROM Game`;
            db.run(insertSql,data,function (err) {
                if (err) {
                  console.error("Error inserting room into database:", err.message);
                } else {
                  console.log(`Room created with GameCode: ${gameCode}`);
                  // Optionally, emit an event back to the client with the game code
                  socket.emit("roomCreated", {
                    gameCode,
                    message: "Room created successfully!",
                  });
                }
              }
            );
        }
        console.log(socket.id + ': ' + msg);
        io.emit("msg", msg);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");//
});


const db = new sqlite3.Database(
    "./collection.db", // Specify your database file path
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        return console.error("Database connection error:", err.message);
      }
      console.log("Connected to SQLite database.");
    }
  );


export default io;