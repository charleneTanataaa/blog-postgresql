import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function NavBar(){
    const [open, setOpen] = useState(false);

    return(
        <nav className="font-mono text-sm flex justify-between mb-10">
            <div className={`flex-1`}>Raft</div>
            <div className={`hidden md:flex-1 md:flex justify-center`}>
                <ul className={`flex gap-4`}>
                    <li className="nav-list">Home</li>
                    <li className="nav-list">All Posts</li>
                    <li className="nav-list">My Posts</li>
                </ul>
            </div>
            {/* mobile */}
            <div className="md:hidden">
                <button 
                    onClick={() => setOpen(!open)} 
                    className=" flex flex-col gap-1 bg-white items-center justify-center cursor-pointer"
                    >
                        <span className={`w-[18px] h-[1px] bg-black`}/>
                        <span className={`w-[18px] h-[1px] bg-black`}/>
                        <span className={`w-[18px] h-[1px] bg-black`}/>
                </button>
            </div>
            <div className={`flex-1 flex justify-end`}>
                <Link
                className={`px-2 py-1 bg-white border border-[var(--pond-deep)] hover:bg-[var(--pond-deep)] hover:text-white transition duration-300`}>
                    Start writing
                </Link>
            </div>
            {open && (
                <div className="md:hidden">
                    <ul className="flex flex-col gap-4">
                        <li><Link onClick={() => setOpen(false)}>Home</Link></li>
                        <li><Link onClick={() => setOpen(false)}>All Posts</Link></li>
                        <li><Link onClick={() => setOpen(false)}>My Post</Link></li>
                    </ul>
                </div>
            )}
        </nav>
    )
}