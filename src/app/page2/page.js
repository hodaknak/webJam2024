'use client';

import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const URL = "http://localhost:3001";

const socket = io(URL);

export default function Page2() {
    const [fieldText, setFieldText] = useState("");

    const pathname = usePathname()
    const params = useSearchParams()

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
            (Room code: <span style={{"fontFamily": "monospace"}}>{getRoomCode()}</span>)
            <p className="text-xl mt-20">
                Your question is:
                <br/><span style={{"fontWeight": "bold"}}>Is a hot dog a sandwich?</span>
            </p>
            <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                type="text"
                value={fieldText}
                onChange={(e) => setFieldText(e.target.value)}
            />
            <button onClick={sendMessage}>send</button>
            <p className="m-40">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>
            <p className="m-40">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>
            <p className="m-40">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>
        </div>
    );
}
