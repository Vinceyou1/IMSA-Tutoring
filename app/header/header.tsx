'use client';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect, useState } from 'react';
import { FirebaseAuthContext } from '../contexts/FirebaseAuthContext';

export default function Header(){
    const provider = new GoogleAuthProvider();
    const auth = useContext(FirebaseAuthContext);
    const [user, loading] = useAuthState(auth);
    const [isMobile, updateMobile] = useState(true);
    let signInOut;
    const signIn = async () => {
        try{  
            const result = await signInWithPopup(auth, provider);
        } catch {}
    }

    useEffect(() => {
        updateMobile(window.innerHeight > window.innerWidth);
    }, [])
    const newrequest = isMobile ? <></> :
    <li className='text-primary dark:text-secondary text-lg p-4 inline'><a href="/request">New Request</a></li>;
    user ? signInOut = (<button className='duration-200 pt-3 pb-3 pl-4 pr-4 text-lg shadow-xl rounded-none mr-4 text-primary dark:text-primary-dark hover:bg-[#ff6666] hover:text-secondary hover:dark:text-secondary-dark' 
         onClick={() => auth.signOut()}>Sign Out</button>) : 
        signInOut = (<button className='duration-200 pt-3 pb-3 pl-4 pr-4 text-lg shadow-xl rounded-none mr-4 text-primary dark:text-primary-dark hover:bg-primary hover:text-secondary hover:dark:bg-primary-dark hover:dark:text-secondary-dark' 
         onClick={() => signIn()}>Sign in</button>);
    return(
        <div className="h-[10%] bg-secondary dark:bg-primary flex items-center justify-between pb-1">
            <ul>
                <li className='text-primary dark:text-secondary text-lg p-4 inline'><a href="/">Home</a></li>
                <li className='text-primary dark:text-secondary text-lg p-4 inline'><a href="/myrequests">My Requests</a></li>
                {newrequest}
            </ul>
            {signInOut}
        </div>
    )
}