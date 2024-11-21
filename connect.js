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

// Executes each statement sequentially
db.serialize(() => {
  let gameInsertions = 0;
  let userInsertions = 0;
  let roomInsertions = 0;

  // Drops then creates game table
  db.run("DROP TABLE IF EXISTS Game");
  db.run(
    `CREATE TABLE IF NOT EXISTS Game (
      GameCode INTEGER PRIMARY KEY,
      RoomList TEXT,
      Host TEXT,
      Messages TEXT,
      GameState TEXT
    )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created Game table.");
    }
  );

  // Data for game table
  const gameArray = [
    ["104", "Room1, Room2, Room3", "Marcus", "", "Questions"],
    ["105", "Room1, Room2", "Will", "", "Presenting"],
    ["106", "Room1", "Daniel", "", "Waiting"]
  ];

  // Insert data into game table
  const insertGameSql = `INSERT INTO Game(GameCode, RoomList, Host, Messages, GameState) VALUES(?, ?, ?, ?, ?)`;
  gameArray.forEach((game) => {
    db.run(insertGameSql, game, function (err) {
      if (err) {
        return console.error("Error inserting row into Game table:", err.message);
      }
      gameInsertions++;
      console.log(`Rows inserted into Game table, ID ${this.lastID}`);
    });
  });

  // Dropping then creates Users table
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
    }
  );

  // Data for Users table
  const users = [
    ["1", "Mark", "104", "1000"],
    ["2", "Walt", "104", "1000"],
    ["3", "Jen", "104", "1002"],
    ["4", "Rob", "105", "1001"],
    ["5", "Jill", "105", "1001"],
    ["6", "Tom", "105", "1000"],
    ["7", "Jake", "106", "1000"],
    ["8", "Kathy", "106", "1000"],
    ["9", "Sarah", "106", "1000"]
  ];

  // Insert data into Users table
  const insertUserSql = `INSERT INTO Users(id, Username, GameCode, BreakoutRoomCode) VALUES(?, ?, ?, ?)`;
  users.forEach((user) => {
    db.run(insertUserSql, user, function (err) {
      if (err) {
        return console.error("Error inserting row into Users table:", err.message);
      }
      userInsertions++;
      console.log(`Rows inserted into Users table, ID ${this.lastID}`);
    });
  });

  // Dropping then creats Rooms table
  db.run("DROP TABLE IF EXISTS Rooms");
  db.run(
    `CREATE TABLE IF NOT EXISTS Rooms (
      RoomID TEXT,
      GameCode TEXT,
      PRIMARY KEY (RoomID, GameCode)
    )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created Rooms table.");
    }
  );

  // Data for roomArray
  const roomArray = [
    ["1001", "104"],
    ["1002", "104"],
    ["1003", "104"],
    ["1001", "105"],
    ["1002", "105"],
    ["1001", "106"]
  ];

  // Insert data into roomArray
  const insertRoomSql = `INSERT INTO Rooms(RoomID, GameCode) VALUES(?, ?)`;
  roomArray.forEach((room) => {
    db.run(insertRoomSql, room, function (err) {
      if (err) {
        return console.error("Error inserting row into Rooms table:", err.message);
      }
      roomInsertions++;
      console.log(`Rows inserted into Rooms table, ID ${this.lastID}`);
    });
  });

  // I had to make this a separate function here cuz this would run before all the data was added
  const checkInsertions = () => {
    if (gameInsertions === gameArray.length && userInsertions === users.length && roomInsertions === roomArray.length) {
      db.all(
        'SELECT * FROM Users INNER JOIN Game ON Users.GameCode = Game.GameCode WHERE Game.GameCode = 104',
        [],
        (err, rows) => {
          if (err) {
            console.error("Error executing query:", err.message);
            return;
          }
          console.log("Rows retrieved:", rows);
          // Close connection
          db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Closed the database connection.");
          });
        }
      );
    }
  };

  // Runs checksInsertion every 100 ms
  const interval = setInterval(checkInsertions, 100);

  // gets rid of the interval once the db closes
  db.on('close', () => {
    clearInterval(interval);
  });
});