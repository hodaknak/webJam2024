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
        GameCode TEXT PRIMARY KEY,
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
          db.run("INSERT INTO Game(GameCode,Host,Messages,GameState) VALUES(?, ?, ?, ?)", ["1234", "ABCD", "d"], (err) => {
              console.log("im here");
              if (err) {
                return console.error(err.message);
              }
              console.log("stuff got inserted");
            })
            const fs = require('fs');
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
    const selectQuestionQuery = "SELECT * FROM questions where id = ?"
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
        let res = null;
        let id = Math.floor(Math.random() * 100) + 1;
        db.all(selectQuestionQuery,[id],(err,rows) => {
          if (err) {
            return console.error(err.message);
          }
          res = rows[0].Question;
          if(res != null) {
            console.log(`Question fetched: ${res}`);
            socket.emit("fetchQuestion", res);
          }
        });
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
        // Generates the game, emits the code

        // Generate the code
        // TODO: check for clashes with the database and regenerate if that is the case
        // TODO: what happens if every code is used up?
        let newGameCode = "";
        let res = null;
        let valid = false;
        db.serialize(() => {
          //ill figure out the unique thing later
          while(valid == false) {
            newGameCode = "";
            for (let i = 0; i < 4; i++) {
              newGameCode += String.fromCharCode(('a'.charCodeAt(0) + Math.floor(Math.random() * 26)))
            }
            console.log(`New Room Code: ${newGameCode}`);
            db.all(selectGameQuery,[newGameCode],(err,rows) => {
              if (err) {
                return console.error(err.message);
              }
              if(rows.length == 0) {
                valid = true;
                console.log(`${socket.id}: creating game of code ${newGameCode}`);
                db.run(insertGameQuery,[newGameCode,socket.id,"","waiting"],(err) => {
                  if (err) {
                    return console.error(err.message);
                  }
                  console.log("Game Created");
                  res = newGameCode;
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
                console.log(`Gamecode: ${res}`);
                socket.emit("createGame", res);
                });
              }
            });
            valid = true;
          }
        });

        // TODO: error handling
    });
    
    socket.on("fetchGame", (msg) => {
        // object should have code field

        let res = null;
        console.log(`${socket.id}: fetching game of code ${msg.code}`);
        db.all(selectGameQuery,[msg.code],(err,rows) => {
          if (err) {
            return console.error(err.message);
          }
          res = rows[0]
          console.log(`Game: ${res}`);
          socket.emit("fetchGame", res);
        });
    });

    socket.on("fetchRoom", (msg) => {
        // object should have name and code field
        // TODO: fetch the room name, the participants in the room, and the messages in the room from db (based on the user's socket ID)
        let res = null;
        let roomID = null;
        let userList = [];
        let data = null;
        console.log(`${socket.id}: fetching room of gamecode ${msg.code} and roomid ${msg.name}`);
        db.serialize(() => {
          db.all(selectRoomQuery,[msg.name,msg.code],(err,rows) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Query result: ", rows);
            res = rows[0];
            roomID = res.RoomID;
            console.log(res.RoomID)
          db.all(selectAllUsersInRoom,[msg.name,msg.code],(err,rows) => {
            if(err) {
              return console.error(err.message);
            }
            console.log("Query result: ", rows)
            rows.forEach(element => {
              userList.push(element.id);
            });
            console.log(userList);
          })
          data = {
            roomName: roomID,
            participants: userList
          }
        })});
        console.log(data);
        //res is currenlty equal to the row of the room
        if(res != null) {
          socket.emit("fetchRoom", data);
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");//
});

//export default io;
