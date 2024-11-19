import Link from "next/link";

export default function Sidebar({isOpen, toggle}) {
    return (
        <>
            <div
                className="sidebar-container w-full overflow-hidden justify-center bg-gray-50 grid left-0 z-10 md:hidden"
                style={{
                    opacity: `${isOpen ? 1 : 0}`,
                    top: `${isOpen ? 0 : "-100%"}`,
                }}
            >
                <ul className="sidebar-nav text-center leading-relaxed text-xl">
                    <li>
                        <Link href="/page1" onClick={toggle}><p>Page 1</p></Link>
                    </li>
                    <li>
                        <Link href="/page2" onClick={toggle}><p>Page 2</p></Link>
                    </li>
                </ul>
            </div>
        </>
    )
}