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

    const getRoomCode = () => {
        // Get the room code
        let res = params.get("code")
        if (res == null) {
            // Invalid
            // TODO: what to do if it does not exist
            return "INVALID CODE!"
        }
        return res
    }


    return (
        <div className="w-full text-center">
            <br/>
            Room code: <span className="codespan">{getRoomCode()}</span>
            <p className="text-xl mt-20">
                Your question is:
                <br/><span style={{"fontWeight": "bold"}}>Is a hot dog a sandwich?</span>
            </p>
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
}
