'use client';
import './headers.css'
import initFirebase from "@/firebase/clientApp";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@mui/material";
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
    })
    const newrequest = isMobile ? <></> :
    <li className='nav'><a href="/request">New Request</a></li>;
    user ? signInOut = (<Button className='Login out' 
        variant='contained' size="large" onClick={() => auth.signOut()}>Sign Out</Button>) : 
        signInOut = (<Button className='Login in' 
        variant='contained' size="large" onClick={() => signIn()}>Sign in</Button>);
    return(
        <div className="h-[10%] bg-secondary dark:bg-primary flex items-center justify-between pb-1">
            <ul>
                <li className='nav'><a href="/">Home</a></li>
                <li className='nav'><a href="/myrequests">My Requests</a></li>
                {newrequest}
            </ul>
            {signInOut}
        </div>
    )
}