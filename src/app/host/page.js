'use client';

import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io(URL);

export default function Host() {
    // TODO: connect to the server to get the generated game code and start the game

    let getGameCode = () => {
        // TODO: get the unique one-time room code based on the current user's connection
        return "In progress..."
    }

    const getParticipants = () => {
        // Get a list of all the participants in the current room
        let res = ["P1", "P2", "P3"];
        return res;
    }

    return (
        <div className="w-full text-center">
            <br/>
            Game code: <span className="codespan">{getGameCode()}</span>
            <div>
                <ul>
                {getParticipants().map((item, index) => (
                    <span style={{"margin": "10px"}} key={index}> {item} </span>
                ))}
                </ul>
            </div>
            <p className="text-xl mt-20">
                You are the host! Give this game code to your participants so they can join.
                <br/>Don't reload this page.
            </p>
            <br/>
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
