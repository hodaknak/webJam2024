'use client';

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io("http://localhost:3001");

export default function SocketTest() {
    const [latestMsg, setLatestMsg] = useState("null");
    const [fieldText, setFieldText] = useState("");

    useEffect(() => {
        socket.on("msg", (msg) => {
            setLatestMsg(msg);
            console.log(msg);
        })
    }, []);

    const sendMessage = () => {
        console.log(fieldText);
        socket.emit("msg", fieldText);
        setFieldText("")
    }

    return (
        <div className="w-full text-center">
            <p className="m-40">{latestMsg}</p>
            <div className="flex justify-center ">
                <input
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    type="text"
                    value={fieldText}
                    onChange={(e) => setFieldText(e.target.value)}
                />
                <button onClick={sendMessage}>send</button>
            </div>
        </div>
    )
}
