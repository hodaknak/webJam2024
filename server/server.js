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

const fs = require('fs');

fs.writeFile("./messages.json", JSON.stringify({}), "utf8", (err) => {
    if (err) {
        throw err;
    }
});

//Creating all of the tables inside of the db
db.serialize(() => {
    let gameTableMade = false;
    let userTableMade = false;
    let roomTableMade = false;
    let questionsTableMade = false;
    db.run("DROP TABLE IF EXISTS Game");
    db.run(
        `CREATE TABLE IF NOT EXISTS Game (
        GameCode INTEGER PRIMARY KEY,
        Host TEXT,
        Messages TEXT,
        GameState TEXT
        )`,
        (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Created Game table.");
        gameTableMade = true;
        }
    );
    db.run("DROP TABLE IF EXISTS Users");
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY,
        Username TEXT,
        GameCode TEXT,
        BreakoutRoomCode TEXT
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Created Users table.");
        userTableMade = true;
      }
    );
    db.run("DROP TABLE IF EXISTS Rooms");
    db.run(
      `CREATE TABLE IF NOT EXISTS Rooms (
        RoomID TEXT,
        GameCode TEXT,
        Question TEXT,
        PRIMARY KEY (RoomID, GameCode)
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Created Rooms table.");
        roomTableMade = true;
      }
    );
    db.run("DROP TABLE IF EXISTS Questions");
    db.run(
        `CREATE TABLE IF NOT EXISTS Questions (
        id INTEGER PRIMARY KEY,
        Question TEXT
    )`,
    (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Created Questions table.");
        questionsTableMade = true;
      }

    )
    //Filling questionList with questions. It has to be done like this or the programs tries to insert the information before the table is created
    const checkTables = () => {
        if (roomTableMade && userTableMade && roomTableMade && questionsTableMade) {
            fs.readFile('questions.json', 'utf-8', (err, data) => {
                if (err) {
                    console.error("File cannot be read: ", err);
                    return;
                }
                const questions = JSON.parse(data);
                questions.forEach(({ id, question }) => {
                    db.run('INSERT INTO Questions(id,Question) VALUES(?,?)',[id,question],(err) => {
                        if (err) {
                          return console.error(err.message);
                        }
                    })
                });
                console.log("Questions inserted");
            clearInterval(interval)
        })
        };
    }
    
    const interval = setInterval(checkTables, 100);
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
    const selectAllUsersInRoom = "SELECT * FROM Users where GameCode = ? And BreakoutRoomCode = ?"
    const selectAllUsersInGame = "SELECT * FROM Users where GameCode = ?"
    const selectAllRoomsInGame = "SELECT * FROM USers where GameCode = ?"

    socket.on("msg", (msg) => {
        let user = socket.id;
        let message = msg.message;
        let datetime = msg.datetime;

        console.log(`${user}: ${message} ${datetime}`);

        // TODO: add message to database
        // TODO: fetch name from database
        // TODO: get all socket ids in the room, use io.sockets.socket(socketid).emit() to send to all clients in room

        let res = {
            name: `whoever ${user} is`,
            message: message,
            datetime: datetime
        };

        io.emit("msg", res);
    });

    socket.on("fetchQuestion", (msg) => {
        // TODO: Create a way to fetch questions and emit it

        const fileContent = readFile("/icebreakers.txt", "utf-8");
        var lines = fileContent.split("\n");
        

        let result = {
            randNum: Math.floor(Math.random() * 99)+1,
            question: lines[randNum]
        };
        socket.emit("fetchQuestion", result);
    });

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
    });

    socket.on("createGame", (msg) => {
        // Generate the code
        // TODO: check for clashes with the database and regenerate if that is the case
        // TODO: what happens if every code is used up?
        let newGameCode = "";
        for (let i = 0; i < 4; i++) {
            newGameCode += String.fromCharCode(('a'.charCodeAt(0) + Math.floor(Math.random() * 26)))
        }
        console.log(`${socket.id}: creating game of code ${newGameCode}`);

        fs.readFile("messages.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err.message);
            } else {
                let obj = JSON.parse(data);

                obj[newGameCode] = {}

                fs.writeFile("messages.json", JSON.stringify(obj), (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                })
            }
        })

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

    socket.on("createRoom", (msg) => {
        // create a room
        let gameCode = msg.code;

        let roomName = 'A';

        let data = [roomName, gameCode]

        db.run(insertRoomQuery, data,(err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Room Inserted");
        });

        fs.readFile("messages.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err.message);
            } else {
                let obj = JSON.parse(data);

                if (gameCode in obj) {
                    obj[gameCode][roomName] = []

                    fs.writeFile("messages.json", JSON.stringify(obj), (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    })
                }
            }
        });

        socket.emit("createRoom", {roomName: roomName});
    });
    
    socket.on("fetchGame", (msg) => {
        // object should have code field

        // TODO: fetch from db
        // TODO: error handling

        let roomCode = msg.code;

        console.log(`${socket.id}: fetching game of code ${roomCode}`);

        // dummy response, actual one will fetch from db
        let res = {
            participants: ["Hodaka's ID", "Caden's ID", "Kyle's ID", "Kelvin's ID", "Green's ID", "Red's ID", "Blue's ID"],
            rooms: [{"name": "A", "users": ["user 1", "user 2"]}, {"name": "C", "users": ["user 3"]}, {"name": "D", "users": ["user 3"]}, {"name": "B", "users": ["user 3"]}, {"name": "B", "users": ["user 3"]}, {"name": "B", "users": ["user 3"]}, {"name": "B", "users": ["user 3"]}]
        };

        socket.emit("fetchGame", res);
    });

    socket.on("fetchRoom", (msg) => {
        // object should have name and code field
      
        if("command" in msg && msg.command === "find room") {
            const data = [msg.roomcode,msg.gamecode]
            db.all(selectRoomQuery,data,(err,rows) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log("Query result: ", rows);
              })
        }

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
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");//
});

//export default io;
