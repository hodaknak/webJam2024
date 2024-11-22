'use client';

import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io(URL);


export default function Host() {
    const [participants, setParticipants] = useState([])
    const [rooms, setRooms] = useState([])
    const [gameCode, setGameCode] = useState("")

    let getGameCode = () => {
        if (gameCode.length == 0) {
            return "In progress..."
        } else {
            return gameCode;
        }
    }

    useEffect(() => {
        socket.on("fetchGame", (msg) => {
            setParticipants(msg.participants);
            setRooms(msg.rooms);
        });

        socket.on("createGame", (msg) => {
            setGameCode(msg.code);
            socket.emit("fetchGame", {code: msg.code});
        });

        socket.on("createRoom", (msg) => {
            console.log(msg);
            //console.log([...rooms, msg]);

            setRooms((prevRooms) => [...prevRooms, msg]);
        });

        socket.on("joined", (msg) => {
            // TODO: update rooms so it updates the cards

            let updatedRooms = msg;

            for (let i = 0; i < rooms.length; i++) {
                let roomName = rooms[i].name;

                if (!(roomName in updatedRooms)) {
                    updatedRooms[roomName] = [];
                }
            };

            let output = []

            for (let roomName of Object.keys(updatedRooms)) {
                output.push({name: roomName, users: updatedRooms[roomName]});
            }

            setRooms(output);
        });

        socket.emit("createGame", {});
        console.log("effect")

        return () => {
            socket.off("createGame"); // Needed to clean up
            socket.off("fetchGame");
            socket.off("createRoom");
            socket.off("joined");
        };
    }, []);

    const getParticipants = () => {
        // Get a list of all the participants in the current game
        // TODO: get all rooms
        let res = participants;
        return res;
    }

    const getRooms = () => {
        // Should be like [{"name": "A", "users": ["user 1", "user 2"]}, {"name": "B", "users": ["user 3"]}]
        //let res = [{"name": "A", "users": ["user 1", "user 2"]}, {"name": "B", "users": ["user 3"]}];
        return rooms;
    }

    const hostAddRoom = () => {
        // TODO: connect to socket and attempt
        // TODO: update/fetch afterwards

        socket.emit("createRoom", {code: gameCode});

    }

    const hostRemoveRoom = () => {
        // TODO: connect to socket and attempt
        // TODO: update/fetch afterwards
    }

    const hostShuffleParticipants = () => {
        // TODO: connect to socket and attempt
        // TODO: update/fetch afterwards
    }

    return (
        <div className="w-full text-center">
            <div className="roundbox">
                <div>Game code: <span className="codespan">{getGameCode()}</span></div>
                <div>
                    <ul>
                        {getParticipants().map((item, index) => (
                            <span style={{"margin": "10px"}} key={index}> {item} </span>
                        ))}
                    </ul>
                </div>
            </div>
            <p className="text-xl mt-20">
                You are the host! Give the above game code to your participants so they can join.
                <br/>Don't reload this page.
            </p>
            <br/>
            <button onClick={hostAddRoom}>+ Add a room</button>
            <button onClick={hostRemoveRoom}>- Remove a room</button>
            <br/>
            <button onClick={hostShuffleParticipants}>Shuffle/distribute participants</button>
            <p className="text-xl mt-20">
                Rooms:
            </p>
            <div style={{"display": "flex", "flexWrap": "wrap"}}>
                {getRooms().map((item, index) => (
                    <div className="roombox" key={index}>
                        <span style={{"fontWeight": "bold"}}>Room {item.name}</span>
                        <br/>
                        <ul>
                            {item.users.map((user, i2) => (
                                <span key={i2}>{user}<br/></span>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/* TODO: List of participants */}
            <p className="m-40">
                Welcome to the game!
            </p>
        </div>
    );
}

/*function MessageBox() {
    const [fieldText, setFieldText] = useState("");

    const sendMessage = () => {
        console.log(fieldText);
        socket.emit("msg", fieldText);
        setFieldText("")
    }

    return (
        <div className="roundbox">
            <input
            className="messagebox border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            type="text"
            value={fieldText}
            onChange={(e) => setFieldText(e.target.value)}
        />
            <button onClick={sendMessage}>send</button>
        </div>
    )
}*/
