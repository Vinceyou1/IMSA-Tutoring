"use client";
import initFirebase from '@/firebase/clientApp';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions'
import Loading from './loading';
import React, { useContext } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Request from './request';
import { FirebaseAuthContext } from './contexts/FirebaseAuthContext';
import { FirebaseFunctionsContext } from './contexts/FirebaseFunctionsContext';

export type RequestJSON = {
  uid: string,
  teacher: string,
  class: string, 
  subject: string,
  name: string,
  info: string,
}

export default function Home() {
  const functions = useContext(FirebaseFunctionsContext);
  const auth = useContext(FirebaseAuthContext);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [data, updateData] = React.useState(Array<RequestJSON>);
  const getData = httpsCallable(functions, 'getData');

  React.useEffect(() =>{
    const fetchData = async () =>{
      let res = await getData();
      let requests = res.data;
      updateData((requests as Array<RequestJSON>));
    }
    fetchData();
    console.log("here");
  }, []);
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
    if(data.length == 0){
      return <Loading />
    }
    let num_cols = screen.height < screen.width ? 4 : 2;
    let cols: RequestJSON[][] = [[data[0]]];
    for(let i = 1; i < num_cols && i < data.length; i++){ cols.push([data[i]]);}
    for(let i = num_cols; i < data.length; i++){
      cols[i % num_cols].push(data[i]);
    }
    return (
      <main className="min-h-[90%] max-w-[100%]">
        <Grid2 container spacing={2} sx={{maxWidth:"100%"}}> 
          {cols.map((col) => {
            return (
              <Grid2 xs={12/num_cols}>
                { col.map((item: RequestJSON) => <Request request={item} />)}
              </Grid2>
            )
          })}
        </Grid2>
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