export default function Page1() {
    return (
        <div className="w-full text-center">
            <p className="text-xl mt-20">
                Ready for an icebreaker?
            </p>
            <br/>
            <div style={{"display": "flex", "justifyContent": "center"}}>
                <div style={{"width": "40%"}}>
                    <div className="roundbox">
                        <input type="text" placeholder="GAME CODE HERE" className="codebox"/>
                        <br/>
                        <br/>
                        <button disabled={true}>Join a game</button>
                    </div>
                    <br/>
                    OR
                    <br/><br/>
                    <div className="roundbox">
                        <button>Create a game</button>
                    </div>
                </div>
            </div>
            <p className="m-40">
                <b>Credits</b>
                <br/>This was created for the ICSSC WebJam 2024 at UCI by Caden Lee, Hodaka Nakamura, Kelvin Wu, and Kyle Kim.
                <br/>Check out the source code on <a className="link-underline" href="https://github.com/hodaknak/webjam2024">GitHub</a>!
            </p>
        </div>
    )
}
