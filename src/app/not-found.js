import Link from 'next/link'
import {redirect} from "next/navigation";

export default function NotFound() {
    return (
        <div className="w-full mt-40 flex justify-center items-center">
            <FrowningFace/>
            <div id="text">
                <p className="text-base">
                    Error 404
                </p>
                <p className="text-3xl text-cyan-400">
                    Page not found
                </p>
                <p className="text-xl">
                    Sorry, the page you were looking for doesn&#39;t exist.
                </p>
                <p className="mt-5 text-sky-500 text-base"><Link href="/">Go back home</Link></p>
            </div>
        </div>
    )
}

function FrowningFace() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
             className="size-28 mr-6 stroke-cyan-400">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
        </svg>
    )
}