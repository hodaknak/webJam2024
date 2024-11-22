"use client"
import Image from "next/image"
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./button"

export default function Logo() {
    return (
        <>
            <Link href="/">
                <Image
                    src="/icebreaker.svg"
                    alt="logo"
                    width={120}
                    height={120}
                    className="relative"
                />
            </Link>
        </>
    )
}