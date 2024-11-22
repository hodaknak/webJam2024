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

//Creating all of the tables inside of the db, drops any existing ones. You won't have to worry about what's in here
db.serialize(() => {
    let gameTableMade = false;
    let userTableMade = false;
    let roomTableMade = false;
    let questionsTableMade = false;
    let questionsInserted = false;
    db.run("DROP TABLE IF EXISTS Game",(err) => {
      console.log("Game table dropped");
    });
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
    db.run("DROP TABLE IF EXISTS Users",(err) => {
      console.log("Users table dropped");
    });
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY,
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
    db.run("DROP TABLE IF EXISTS Rooms",(err) => {
      console.log("Rooms table dropped");
    });
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
    db.run("DROP TABLE IF EXISTS Questions",(err) => {
      console.log("Questions table dropped");
    });
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
        if (gameTableMade && userTableMade && roomTableMade && questionsTableMade && !questionsInserted) {
          clearInterval(interval)
          questionsInserted = true;
          //This is Kyle's dummy data for testing socket.on events
          db.run("INSERT INTO Game(GameCode, Host, Messages, GameState) VALUES(?, ?, ?, ?)", ["ABCD","Jeff","","playing"], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Game inserted");
          })
          db.run("INSERT INTO Rooms(RoomID,GameCode,Question) VALUES(?, ?, ?)", ["1000","ABCD","is hot dog a sandwich"], (err) => {
              if (err) {
                return console.error(err.message);
              }
              console.log("Room inserted");
            })
          db.run("INSERT INTO Rooms(RoomID,GameCode,Question) VALUES(?, ?, ?)", ["1001","ABCD","is hot dog a taco"], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Room inserted");
          })
          db.run("INSERT INTO Rooms(RoomID,GameCode,Question) VALUES(?, ?, ?)", ["1002","ABCD","is hot dog a burritio"], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Room inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["2","John5","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["3","John2","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["4","John3","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["5","John5","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["6","John2","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["7","John3","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
          })
          db.run("INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)", ["8","John3","ABCD",""], (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("User inserted");
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
    const insertRoomQuery = "INSERT INTO rooms (RoomID,GameCode,Question) Values(?,?,?)";
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
    const selectAllRoomsInGame = "SELECT * FROM Rooms where GameCode = ?"

    socket.on("msg", (msg) => {
        let user = socket.id;
        let message = msg.message;
        let datetime = msg.datetime;
        let roomCode = msg.code;
        let roomName = msg.room;

        console.log(`${user}: ${message} ${datetime}`);

        db.all(selectUserQuery, [user], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }

            let name = rows[0].Username;

            let res = {
                name: name,
                message: message,
                datetime: datetime
            };

            fs.readFile("messages.json", "utf-8", (err, data) => {
                if (err) {
                    console.error(err.message);
                } else {
                    let obj = JSON.parse(data);

                    obj[roomCode][roomName].push(res);

                    fs.writeFile("messages.json", JSON.stringify(obj), (err) => {
                        if (err) {
                            console.error(err.message);
                        } else {
                            // TODO: only send to people in room

                            db.all(selectAllUsersInRoom, [roomCode, roomName], (err, rows) => {
                                if (err) {
                                    return console.error(err.message);
                                }
                                rows.forEach(element => {
                                    let socketid = element.id;
                                    console.log(socketid)

                                    io.to(socketid).emit("msg", res);
                                });
                            });
                        }
                    })
                }
            });
        })
    });
    socket.on("join", (msg) => {
        let gameCode = msg.code;

        let query = "SELECT * FROM Users";

        db.all(selectAllUsersInGame, [gameCode], (err, rows) => {
            let res = {};

            for (let row of rows) {
                let name = row.BreakoutRoomCode;
                let username = row.Username;

                if (name in res) {
                    res[name].push(username);
                } else {
                    res[name] = [username];
                }
            }

            console.log(res);

            io.emit("joined", {code: gameCode, rooms: res});
        });
    });

    socket.on("username", (msg) => {
        let users = [];
        let duplicate = 1;
        let valid = false;
        let username = null;
        db.all("SELECT * FROM Users",(err,rows) => {
          if (err) {
            return console.error(err.message);
          }
          //creates an array with the usernames of all existing users
          rows.forEach(element => {
            users.push(element.Username)
          });
          console.log(users);
          //checks if the msg.username is already in users array
          if(users.includes(msg.username)) {
            //keeps making the duplicate number bigger until it doesn't match any usernames in the database
            while(valid == false) {
              console.log(msg.username+duplicate.toString());
              duplicate++;
              //valid turns true as soon as the username isn't found in the DB
              if(!users.includes(msg.username+duplicate.toString())) {
                valid = true;
                username = msg.username+duplicate.toString();
              }
            }
          }
          else {
            username = msg.username;
          }

          //this query inserts the new user into the User Table

            db.run(insertUserQuery,[socket.id, username, msg.code, msg.room],(err) => {
                if(err) {
                    return console.error(err.message);
                }
                console.log(`${socket.id} set their username to ${username}`);
                socket.emit("connection",username);
            })
        });
    });

    //this call is meant to put all of the users into one room
    socket.on("mergeRoom", (msg) => {
      let users = [];
      let host = null;
      let newRoomID = null;
      let newQuestion = null;
      
      db.serialize(() => {
        //retrives the host
        db.all(selectGameQuery,[msg.code],(err,rows) => {
          if(err) {
            return console.error(err.message);
          }
          host = rows[0].Host;
        });

        //retrives every room in the current game and deletes it
        db.all(selectAllRoomsInGame,[msg.code],(err,rows) => {
          if(err) {
            return console.error(err.message);
          }
          //this sets the RoomID of the merged room to one of the existing rooms
          newRoomID = rows[0].RoomID;
          rows.forEach(element => {
            db.run("DELETE FROM Rooms Where GameCode = ?",[msg.code], (err) => {
              if(err) {
                return console.error(err.message);
              }
              console.log("removed");
            })
          });
          //TODO: I harded coded the question because im not sure how you want to generate this 
          newQuestion = "is a hot dog a sandwich";
          //creates new room with the RoomID 
          db.run(insertRoomQuery,[newRoomID,msg.code,newQuestion],(err) => {
            if(err) {
              return console.error(err.message);
            }
            //finds all of the users within the current game
            db.all(selectAllUsersInGame,[msg.code],(err,rows) => {
              if(err) {
                return console.error(err.message);
              }
              //changes the RoomID of each user to the new room we created
              rows.forEach(element => {
                db.run("UPDATE Users SET BreakoutRoomCode = ? WHERE id = ?",[newRoomID,element.id], (err) => {
                  if(err) {
                    return console.error(err.message);
                  }
                });
              });
              //gathers all of the users in the current game and pushes them into one array (Looking back I don't need this sql query but since it works we'll keep it)
              db.all(selectAllUsersInGame,[msg.code],(err,rows) => {
                if(err) {
                  return console.error(err.message);
                }
                rows.forEach(element => {
                  users.push(element.id);
                });
                //sets up the data that will be returned
                data = {
                  host_id: host,
                  participants: users,
                  question: newQuestion,
                }
                console.log(data);
                socket.emit("mergeRoom",data);
              });
            });
          });
        });
      });
    });

    // this call will randomly shuffle every current user in a game into a new room
    socket.on("mixRooms", (msg) => {
      let roomIDs = [];
      let userIDs = [];
      db.serialize(() => {
        //creates a list of every userID
        db.all(selectAllUsersInGame,[msg.code], (err,rows) => {
          if(err) {
            return console.error(err.message) 
          }
          rows.forEach(element => {
            userIDs.push(element.id);
          });
        })
        //creates a list of every roomID
        db.all(selectAllRoomsInGame,[msg.code], (err,rows) => {
          if(err) {
            return console.error(err.message) 
          }
          rows.forEach(element => {
            roomIDs.push(element.RoomID);
          });
          let roomIndex = 0;
          //this goes through the list and performs a bunch of swaps to randomize the order
          for(let i = 0; i<userIDs.length; i++) {
            const random = Math.floor(Math.random() * userIDs.length);
            const temp = userIDs[i];
            userIDs[i] = userIDs[random];
            userIDs[random] = temp;
          }

          // gives ever user a new BreakoutRoomCode. the BreakoutRoomCode is generated by iterating through the roomIDs array
          userIDs.forEach(element => {
            if(roomIndex == roomIDs.length) {
              roomIndex = 0;
            }
            db.run("UPDATE Users SET BreakoutRoomCode = ? WHERE id = ?",[roomIDs[roomIndex],element], (err) => {
              if(err) {
                return console.error(err.message) 
              }
            })
            roomIndex++;
          })
          // this outputs a message to every user, letting them know that new rooms have been assigned to them
          console.log("All users have been assigned to new rooms");
          io.emit("connection","New Rooms Have Been Assigned");
        })
      })
    })

    //this call creates a game
    socket.on("createGame", (msg) => {
      
        // TODO: check for clashes with the database and regenerate if that is the case
        // TODO: what happens if every code is used up?
        let newGameCode = "";
        let res = null;
        let valid = false;
        let codes = [];
        // looks for every game that currently exists in the DB and makes an array with all of their GameCodes
        db.all("SELECT * FROM Game",(err,rows) => {
            if (err) {
                return console.error(err.message);
            }
            rows.forEach(element => {
                codes.push(element.GameCode)
            });
            // generates a newGameCode until one that isn't in the newGameCode is found
            while(valid == false) {
                newGameCode = "";

                for (let i = 0; i < 4; i++) {
                  newGameCode += String.fromCharCode(('a'.charCodeAt(0) + Math.floor(Math.random() * 26)))
                }
                if(!codes.includes(newGameCode)) {
                  valid = true;
                } else {
                  console.log("code repeated");
                }
            }
            // inserts the newly created game into the Game table
            db.run(insertGameQuery,[newGameCode, socket.id, "", "waiting"],(err) => {
                if (err) {
                  return console.error(err.message);
                }
                console.log("Game Created");
                res = {code: newGameCode};

                //updates the messages.json to have all of the games.
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
                    }});

                //the GameCode is emitted here
                console.log(`Gamecode: ${res}`);
                socket.emit("createGame",res);
            })
        });
    })

    socket.on("createRoom", (msg) => {
        // create a room
        // create a room
        let gameCode = msg.code;

        let roomName = '';

        // gets the latest room added (sorted in alphabetical order), so we can make a new room with the next alphabet

        let query = "SELECT RoomID FROM rooms WHERE GameCode = ? ORDER BY RoomID DESC LIMIT 1"

        let data;

        db.all(query, [gameCode], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }

            console.log("Query result: ", rows);

            if (rows.length === 0) {
                roomName = 'A';
            } else {
                let roomid = rows[0].RoomID;

                roomName = String.fromCharCode(roomid.charCodeAt(0) + 1);
            }

            //random number between 1 and 100 inclusive is generated for the 100 questions we have
            let id = Math.floor(Math.random() * 100) + 1;
            db.all(selectQuestionQuery, [id], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                let question = rows[0].Question;

                data = [roomName, gameCode, question];

                db.run(insertRoomQuery, data,(err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log("Room Inserted");

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
                                    } else {
                                        socket.emit("createRoom", {name: roomName, users: []});
                                    }
                                })
                            }
                        }
                    });
                });
            });
        });
    });

    //fetches a game from the server
    socket.on("fetchGame", (msg) => {
        let res = null;
        let userList = [];
        let roomList = [];
        console.log(`${socket.id}: fetching game of code ${msg.code}`);
        //finds the game in the database
        db.all(selectGameQuery, [msg.code], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            //sets res to the first entry
            res = rows[0];
            //this finds all of the users in the game and creates an array with all of their ids
            db.all(selectAllUsersInGame, [msg.code], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                rows.forEach(element => {
                    userList.push(element.id);
                });
                //this finds all of the rows in the game and creates an array with all of their RoomIDs
                db.all(selectAllRoomsInGame, [msg.code], (err, rows) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    rows.forEach(element => {
                        roomList.push(element.RoomID);
                    })
                    //creates the data to send back
                    let data = {
                        participants: userList,
                        rooms: roomList
                    }
                    console.log(data);
                    socket.emit("fetchGame", data);
                })
            });

        });
    });



    //fetches the room and returns roomName, participants, and the question
    socket.on("fetchRoom", (msg) => {
        let roomCode = msg.code;
        let userList = [];

        // select a random room

        let query = "SELECT * FROM Rooms WHERE GameCode = ? ORDER BY RANDOM() LIMIT 1;"

        db.all(query, [roomCode], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }

            let name = rows[0].RoomID;
            let question = rows[0].Question

            // get all participants

            db.all(selectAllUsersInRoom, [roomCode, name], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                rows.forEach(element => {
                    userList.push(element.username);
                });


                fs.readFile("messages.json", "utf-8", (err, data) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        let obj = JSON.parse(data);

                        let messages = obj[roomCode][name];

                        let res = {
                            messages: messages,
                            participants: userList,
                            roomName: name,
                            question: question
                        }

                        socket.emit("fetchRoom", res);
                    }
                });
            });
        });
    });

    //fetches user and returns all of their column data in an array
    socket.on("fetchUser", (msg) => {
      let res = null;
      db.all(selectUserQuery,[msg.id],(err,rows) => {
        if(err) {
          return console.error(err.message);
        }
        res = rows[0];
        console.log(res);
        socket.emit("fetchUser", res)
      });
    })


    //fetches a question from the questions taable
    socket.on("fetchQuestion", (msg) => {
        let res = null;
        //random number between 1 and 100 inclusive is generated for the 100 questions we have
        let id = Math.floor(Math.random() * 100) + 1;
        db.all(selectQuestionQuery, [id], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            res = rows[0].Question;
            if (res != null) {
                console.log(`Question fetched: ${res}`);
                socket.emit("fetchQuestion", res);
            }
        });
    });
      
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
});

server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");//
});

//export default io;