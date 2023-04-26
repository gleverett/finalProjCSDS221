import {FcGoogle} from 'react-icons/fc';
import {signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { useRouter } from 'next/router';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

export default function Login() {

    //Sign in with Google
    const googleProvider = new GoogleAuthProvider();
    const route = useRouter();
    const [user, loading] = useAuthState(auth);

    const GoogleLogin = async() => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            route.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if(user) {
            route.push("/");
        } else {
            console.log('login');
        }
    }, [user]);

    return(
        <div className="bg-amber-100 shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
            <h2 className="text-xl font-medium">A Social Media Network of Post It Notes</h2>
            {/* <h2 className="text-2xl font-medium">Join Today</h2> */}
            
            <div className="py-4">
                <h3 className="py-4">Sign in with one of the providers</h3>
                <button onClick={GoogleLogin} className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2">
                    <FcGoogle className="text-2xl"></FcGoogle>
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}