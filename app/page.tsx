"use client";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions'
import Loading from './loading';
import React, { useContext } from 'react';
import { FirebaseAuthContext } from './contexts/FirebaseAuthContext';
import { FirebaseFunctionsContext } from './contexts/FirebaseFunctionsContext';
import Grid from './home_components/grid';
import Filter from './home_components/filter';

export type RequestJSON = {
  uid: string,
  teacher: string,
  class: string, 
  subject: string,
  name: string,
  info: string,
  time: number,
  claimed: boolean,
  tutor: string,
}

export type DocumentJSON = {
  id: string,
  data: RequestJSON
}

export type Filter = {
  classes: string[]
}

export default function Home() {
  const functions = useContext(FirebaseFunctionsContext);
  const auth = useContext(FirebaseAuthContext);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();


  const [data, updateData] = React.useState(Array<DocumentJSON>);
  const [retrieved, updateRetrieved] = React.useState(false);
  const getData = httpsCallable(functions, 'getData');

  // Filters
  const emptyFilter:Filter = {classes: []};
  const [filter, updateFilter] = React.useState(emptyFilter);

  React.useEffect(() =>{
    const fetchData = async () =>{
      let res = await getData();
      let requests = res.data;
      updateData((requests as Array<DocumentJSON>));
      updateRetrieved(true);
    }
    fetchData();
  }, []);
  if(loading){
    return (<Loading />)
  }
  if(user){
    const email = user.email;
    if(email?.slice(email.indexOf("@")) != "@imsa.edu"){
      return (
        <main className="min-h-[90%]">
          <p className='text-center'>Please reload the page and sign in with your IMSA email.</p>
        </main>
      )
    }
    
    let grid;
    if(!retrieved){
      grid =  <Loading />
    } else {
      grid = <Grid data={data} filter={filter}/>
    }
    return (
      <div className={"w-[100%] h-[90%]"}>
        <Filter filter={filter} updateFilter={updateFilter}/>
        {grid}
      </div>
    );
  }

  return (
    <div className='flex min-h-[80%] items-center justify-center'>
      <div>
          <h1 className='text-center text-lg'>Welcome to IMSA Tutoring!</h1>
          <h3 className='text-center text-lg'>Sign in with your IMSA email to get started</h3>
          <div className='h-12'></div>
      </div>
    </div>
  )
}