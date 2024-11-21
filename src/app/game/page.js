'use client';

import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io(URL);

export default function Game() {
    const pathname = usePathname()
    const params = useSearchParams()

    useEffect(() => {
        socket.on("msg", (msg) => {
            //setLatestMsg(msg);
            // TODO: add the message(s)
            console.log(msg);
        })
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

    const getParticipantsInRoom = () => {
        // Get a list of all the participants in the current room
        // TODO: actually get the participants from the server
        let res = ["P1", "P2", "P3"];
        return res;
    }

    return (
        <div className="w-full text-center">
            <br/>
            Game code: <span className="codespan">{getGameCode()}</span>
            <div>
                <ul>
                {getParticipantsInRoom().map((item, index) => (
                    <span style={{"margin": "10px"}} key={index}> {item} </span>
                ))}
                </ul>
            </div>
            <p className="text-xl mt-20">
                Your question is:
                <br/><span style={{"fontWeight": "bold"}}>Is a hot dog a sandwich?</span>
            </p>
            <br/>
            <br/>
            <MessageBox/>
            <p className="m-40">
                Welcome to the room!
            </p>
        </div>
    );
}

function MessageBox() {
    const [fieldText, setFieldText] = useState("");

    const sendMessage = () => {
        // Try to send the message
        // Valid?
        if (fieldText.length == 0) {
            return;
        }
        console.log(fieldText);
        socket.emit("msg", fieldText);
        setFieldText("")
    }

    const keyDown = (event) => {
        const key = event.key;
        if (key == "Enter") {
            sendMessage();
        }
    }

    return (
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
    )
}
