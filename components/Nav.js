import Link from "next/link";
import { auth } from "@/utils/firebase";
import {useAuthState} from "react-firebase-hooks/auth";

export default function Nav() {
    const [user, loading] = useAuthState(auth);
    console.log(user);
    return(
        <nav className="flex justify-between items-center py-10">
            <Link href="/">
                <button className="text-lg font-medium">Post It.</button>
            </Link>
            <ul className="flex items-center gap-10">
                {!user && (
                <Link href={"/auth/login"} className="py-2 px-4 text-sm bg-purple-300 text-white rounded-lg font-medium ml-8">
                    Join Now
                </Link>)}
                {user && (
                    <div className="flex items-center gap-6">
                        <Link href="/post">
                            <button className="font-medium bg-purple-300 text-white py-2 px-4 rounded-mg text-sm">Post</button>
                        </Link>
                        <Link href="/dashboard">
                            <img className="w-12 rounded-full cursor-pointer" src={user.photoURL}/>
                        </Link>
                    </div>
                )}
            </ul>
        </nav>
    );
}