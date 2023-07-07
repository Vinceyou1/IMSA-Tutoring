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
  id: string,
  data:{
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
}

export default function Home() {
  const functions = useContext(FirebaseFunctionsContext);
  const auth = useContext(FirebaseAuthContext);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();


  const [data, updateData] = React.useState(Array<RequestJSON>);
  const [retrieved, updateRetrieved] = React.useState(false);
  const getData = httpsCallable(functions, 'getData');

  // Filters
  const [subjectFilter, updateSubjectFilter] = React.useState("");
  const [classFilter, updateClassFilter] = React.useState("");

  function filterData(value:RequestJSON, index:number, arr:Array<RequestJSON>) {
    if(value['data']['claimed'] ||
      (subjectFilter != "" && value['data']['subject'] != subjectFilter) ||
      (classFilter != "" && value['data']['subject'] != classFilter)
    ) {
      arr.splice(index, 1);
    }
  }

  React.useEffect(() =>{
    const fetchData = async () =>{
      let res = await getData();
      let requests = res.data;
      updateData((requests as Array<RequestJSON>));
      updateRetrieved(true);
    }
    const getFilters = () => {
      const subjectItem = localStorage.getItem("subjectFilter");
      const classItem = localStorage.getItem("classFilter");
      updateSubjectFilter(subjectItem ? subjectItem : "");
      updateClassFilter(classItem ? classItem : "");
    }
    fetchData();
    getFilters();
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
    if(!retrieved){
      return <Loading />
    }
    if(data.length == 0){
      return(
        <div className='h-[80%] flex justify-center items-center text-lg'>
          <p>There are no requests at this time</p>
        </div>
      );
    }
    const filtered = JSON.parse(JSON.stringify(data));
    filtered.filter(filterData);
    if(filtered.length == 0){
      return(
        <div className='h-[80%] flex justify-center items-center text-lg'>
          <p>There are no requests with the selected filters</p>
        </div>
      )
    }
    let num_cols = screen.height < screen.width ? 4 : 2;
    let cols: RequestJSON[][] = [[filtered[0]]];
    for(let i = 1; i < num_cols && i < filtered.length; i++){ cols.push([filtered[i]]);}
    for(let i = num_cols; i < filtered.length; i++){
      cols[i % num_cols].push(filtered[i]);
    }
    return (
      <main className="max-w-[100%]">
        <Grid2 container sx={{maxWidth:"100%", marginRight:1, marginTop: 0.5}}> 
          {cols.map((col) => {
            return (
              <Grid2 key={cols.indexOf(col)} xs={12/num_cols}>
                { col.map((item: RequestJSON) => <Request key={item.data.time} request={item} />)}
              </Grid2>
            )
          })}
        </Grid2>
      </main>
    )
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