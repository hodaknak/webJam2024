'use client';

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io("http://localhost:3001");

export default function SocketTest() {
    const [latestMsg, setLatestMsg] = useState("null");

    useEffect(() => {
        socket.on("fetchRoom", (msg) => {
            console.log(msg);
        })
    }, []);

    const fetchMessages = () => {
        let data = {
            host_id: "Jeff",
            code: "ABCD",
            name: "1234",
            id: "3",
            username: "John"
            
        }
        socket.emit("removeRoom",data);
    }

    return (
        <div className="w-full text-center">
            <p className="m-40">{latestMsg}</p>
            <div className="flex justify-center ">
                <button onClick={fetchMessages}>request room data</button>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <div>bye</div>
        </div>
    )
}
