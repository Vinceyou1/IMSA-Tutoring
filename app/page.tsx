"use client";
import initFirebase from '@/firebase/clientApp';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from './loading';

type RequestProps = {
  displayName: string,
  body: string,
  class: string, 
  claimed: boolean,
  tutor: string
}

export default function Home() {
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if(loading){
    return (<Loading />)
  }
  if(user){
    const email = user.email;
    if(email?.slice(email.indexOf("@")) != "@imsa.edu"){
      return (
        <main className="flex items-center justify-center min-h-[90%]">
          <p className='text-center'>Please reload the page and sign in with your IMSA email.</p>
        </main>
      )
    }
    return (
      <main className="items-center justify-between min-h-[90%]">
        
      </main>
    )
  }

  return (
    <div className='min-h-[90%] items-center justify-center'>
      <div>
          <h1 className='text-center'>Welcome to IMSA Tutoring!</h1>
          <h3 className='text-center'>Sign in with your IMSA email to get started</h3>
          <div className='h-12'></div>
      </div>
    </div>
  )
}