"use client";
import initFirebase from '@/firebase/clientApp';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from '@mui/material';
import { NextPage } from 'next';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

// Import the functions you need from the SDKs you need


// Initialize Firebase

const Home: NextPage = () => {
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if(loading){
    return (<div>Loading...</div>)
  }
  if(user){
    router.push("/hello")
    return (<div>Loading...</div>)
  }

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  }

  return (
    <div className='h-screen'>
      <p>Hello!</p>
      <Button variant='contained' onClick={signIn}>Sign In</Button>
    </div>
  )
}
export default Home