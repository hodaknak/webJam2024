'use client';

import React, { useState } from "react"

export default function Page1() {
    return (
        <div className="w-full text-center">
            <p className="text-xl mt-20">
                Ready for an icebreaker?
            </p>
            <br/>
            <div style={{"display": "flex", "justifyContent": "center"}}>
                <div style={{"width": "40%"}}>
                    <JoinBox/>
                    <br/>
                    OR
                    <br/><br/>
                    <CreateBox/>
                </div>
            </div>
            <p className="m-40">
                <b>Credits</b>
                <br/>This was created for the ICSSC WebJam 2024 at UCI by Caden Lee, Hodaka Nakamura, Kelvin Wu, and Kyle Kim.
                <br/>We used Next.js, React, and other technologies.
                <br/>Check out the source code and get more information on <a className="link-underline" href="https://github.com/hodaknak/webjam2024">GitHub</a>!
            </p>
        </div>
    )
}

function JoinBox() {
    const [currentCode, setCurrentCode] = useState("");
    const handleChange = (event) => {
        const value = event.target.value;
        setCurrentCode(value)
    }
    const disableButton = () => {
        // Depending on current code
        // TODO: fix this to match however we choose code lengths, and verify the game exists on the server
        let isValid = currentCode.length == 4;
        return !isValid;
    }
    return (
        <div className="roundbox">
            <input onChange={handleChange} autoFocus={true} type="text" placeholder="ENTER JOIN CODE" className="codebox"/>
            <br/>
            <br/>
            <button disabled={disableButton()}>Join game</button>
        </div>
    )
}

function CreateBox() {
    return (
        <div className="roundbox">
            <button>Create a game</button>
        </div>
    )
}
