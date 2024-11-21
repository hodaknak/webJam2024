'use client';

import React, { useState } from "react"

export default function Page1() {
    // TODO: connect to the server to verify that the game code exists before allowing the user to join
    // TODO: allow the user to actually join/create the game: send them to the game page and do the necessary updates on the server (ex. setting them as the host)
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
    const isCodeValid = (code) => {
        // Depending on current code
        // TODO: fix this to match however we choose code lengths/validity, and also verify the game exists on the server
        let isValid = code.length == 4;
        return isValid;
    }
    const keyDown = (event) => {
        const key = event.key;
        if (key == "Enter" && isCodeValid(currentCode)) {
            submit();
        }
    }
    const submit = () => {
        if (!isCodeValid(currentCode)) {
            // Invalid code
            return;
        }
        // Try to submit the join request with the code
        console.log("Submitting the join request with code `" + currentCode + "`...")
        // TODO: impl
    }
    return (
        <div className="roundbox">
            <input onChange={handleChange} autoFocus={true} type="text" placeholder="ENTER JOIN CODE" className="codebox" onKeyDown={keyDown}/>
            <br/>
            <br/>
            <button disabled={!isCodeValid(currentCode)} onClick={submit}>Join game</button>
        </div>
    )
}

function CreateBox() {
    const submit = () => {
        // Try to submit the create request
        console.log("Submitting the create request...")
        // TODO: impl
    }
    return (
        <div className="roundbox">
            <button onClick={submit}>Create a game</button>
        </div>
    )
}