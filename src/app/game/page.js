'use client';

import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io(URL);

const timezoneOffset = new Date().getTimezoneOffset() * 60000;

const fetchRoom = (roomName, code) => {
    let data = {
        //name: roomName, // We won't have access to this: fetchRoom is supposed to give it to us
        code: code
    }

    socket.emit("fetchRoom", data);
}

//fetchMessages();

export default function Game() {
    const [messages, setMessages] = useState([]);
    const [fieldText, setFieldText] = useState("");
    const [username, setUsername] = useState("");
    const [finishedUsername, setFinishedUsername] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [roomName, setRoomName] = useState("");

    const pathname = usePathname()
    const params = useSearchParams()

    // how this will work: every time a message is sent to the server, add the message to the client's local message history
    // so we don't have to fetch from the database every time. The server will broadast the message to every other client so
    // they can do the same
    // the database will only be used when a new user joins the room, and has to fetch all the past messages
    // so we fetch the messages from database here

    useEffect(() => {
        socket.on("fetchRoom", (msg) => {
            setMessages(msg.messages);
            setParticipants(msg.participants);
            setRoomName(msg.roomName);
        });

        socket.on("msg", (msg) => {
            console.log(`Received message: ${msg}`);
            // Add the new message
            setMessages((prevMessages) => [...prevMessages, msg]);
            console.log(messages);
        })

        fetchRoom(getRoomName(), getGameCode());

        //return () => socket.off("fetchRoom"); // Needed to clean up?
    }, []);

    const getGameCode = () => {
        // Get the room code
        let res = params.get("code");
        if (res == null) {
            // Invalid
            // TODO: what to do if it does not exist
            return "INVALID CODE!"
        }
        return res;
    }

    const getRoomName = () => {
        // Get the room name
        return roomName;
    }

    const getParticipantsInRoom = () => {
        // Get a list of all the participants in the current room
        // TODO: actually get the participants from the server
        let res = participants;
        return res;
    }

    const sendMessage = () => {
        // Try to send the message
        // Valid?
        if (fieldText.length === 0) {
            return;
        }

        let hourminute = new Date();

        let data = {
            name: username, // the server doesn't actually need this, just put whatever is stored locally
            message: fieldText,
            datetime: `${hourminute.getHours()}:${hourminute.getMinutes()}`
        };

        socket.emit("msg", data);
        setFieldText("")

        // The following line is unnecessary since the server should re-emit the processed message to all members of the room (including the sender)
        //setMessages((prevMessages) => [...prevMessages, data]);
    }

    const submitUsername = () => {
        if (username.length == 0) {
            // Invalid username
            return;
        }
        setFinishedUsername(true);
        // TODO: submit the username
        let data = {
            username: username
        };
        socket.emit("username", data);
        // TODO: update the current username based on the result
    }

    const keyDown = (event) => {
        const key = event.key;
        if (key === "Enter") {
            sendMessage();
        }
    }

    const usernameKeyDown = (event) => {
        const key = event.key;
        if (key === "Enter") {
            submitUsername();
        }
    }

    return (
        <>
            <style>{'html, body { height: 100%; margin: 0; }'}</style>
            <div className="w-full text-center flex flex-col justify-between" style={{height: 'calc(100% - 5rem)'}}>
                <div className="roundbox">
                    <div>Game code: <span className="codespan">{getGameCode()}</span></div>
                    <div>Room name: <span className="codespan">{getRoomName()}</span></div>
                    <div>
                        <ul>
                            {getParticipantsInRoom().map((item, index) => (
                                <span style={{"margin": "10px"}} key={index}> {item} </span>
                            ))}
                        </ul>
                    </div>
                </div>
                <div style={{"display": "flex", "justifyContent": "center"}}>
                    <div style={{"maxWidth": "1000px", "minWidth": "500px"}}>
                        <div hidden={finishedUsername}>
                            What should everyone call you?
                            <br/>
                            <input
                                className="messagebox border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                style={{"width": "50%"}}
                                type="text"
                                value={username}
                                placeholder="Enter a username"
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={usernameKeyDown}
                                autoFocus={true}
                            />
                            <br/>
                            <button onClick={submitUsername}>Join</button>
                            <div style={{"height": "50%"}}>
                            </div>
                            <br/>
                        </div>
                        <div hidden={!finishedUsername}>
                            {/* TODO: Provide some instructions */}
                            <p className="text-xl mt-16">
                                Your question is:
                                <br/><span style={{"fontWeight": "bold"}}>Is a hot dog a sandwich?</span>
                            </p>
                            <br/>
                            <div className="flex flex-col justify-end flex-grow border-t-4 border-t-sky-400 mb-4">
                                <br/>
                                {messages.map((msg, index) => (
                                    <div key={index} className={msg.name == username ? "yourmessage" : ""}>{msg.datetime} {msg.name}: {msg.message}</div>
                                ))}
                            </div>
                            <div className="roundbox">
                                <input
                                    className="messagebox border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                                    type="text"
                                    value={fieldText}
                                    placeholder="What are your thoughts?"
                                    onChange={(e) => setFieldText(e.target.value)}
                                    onKeyDown={keyDown}
                                />
                                <button onClick={sendMessage}>send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
