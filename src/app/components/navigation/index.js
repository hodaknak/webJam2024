"use client";
import { useState } from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <Navbar toggle={toggle}/>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
        </>
    )
}