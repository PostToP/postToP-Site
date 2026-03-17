import Link from "next/link";
import UserDropdownMenu from "../Misc/UserDropdownMenu";

export default function Navbar() {
    return (
        <nav className="w-full h-16 bg-primary flex items-center px-4">
            <Link href="/">
                <h1 className="text-lg font-bold">PostToP</h1>
            </Link>
            <div className="ml-auto">
                <UserDropdownMenu />
            </div>
        </nav>
    );
}
