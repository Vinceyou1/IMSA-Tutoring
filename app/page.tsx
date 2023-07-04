"use client";
import initFirebase from '@/firebase/clientApp';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from '@mui/material';
import { NextPage } from 'next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import Loading from './loading';

// Import the functions you need from the SDKs you need


// Initialize Firebase

const Home: NextPage = () => {
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  if(loading){
    return (<Loading />)
  }
  if(user){
    router.push("/hello")
    return (<Loading />)
  }

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  }

  return (
    <div className='h-full flex items-center justify-center'>
      <div>
          <h1 className='text-center'>Welcome to IMSA Tutoring!</h1>
          <h3 className='text-center'>Sign in with your IMSA email to get started</h3>
          <div className='h-12'></div>
          <div className='flex justify-center'>
            <Button  variant='contained' onClick={signIn}>Sign In</Button>
          </div>
      </div>
      
    </div>
  )
}
export default Home