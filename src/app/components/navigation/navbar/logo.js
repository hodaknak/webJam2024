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
                    src="/favicon.ico"
                    alt="logo"
                    width={60}
                    height={60}
                    className="relative"
                />
            </Link>
        </>
    )
}