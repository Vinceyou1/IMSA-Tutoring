"use client";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { httpsCallable } from 'firebase/functions'
import Loading from '../loading';
import React, { useContext } from 'react';
import { FirebaseAuthContext } from '../contexts/FirebaseAuthContext';
import { FirebaseFunctionsContext } from '../contexts/FirebaseFunctionsContext';
import Grid from '../home_components/grid';
import { MobileContext } from '../contexts/MobileContext';
import { classes } from '../classes/classes';
import { DocumentJSON, Filter } from "../page";

export function getAllClasses(){
  let temp_filter:Filter = {classes:[]};
  for (const [key, value] of Object.entries(classes)) {
    value.forEach((element) => {
      temp_filter.classes.push(element);
    })
  }
  return temp_filter
}


export default function Home() {
  const functions = useContext(FirebaseFunctionsContext);
  const auth = useContext(FirebaseAuthContext);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [data, updateData] = React.useState([] as Array<DocumentJSON>);
  const [retrieved, updateRetrieved] = React.useState(false);

  // Filters  
  const myFilter:Filter = {classes: ["mine"]};

  const [isMobile, updateMobile] = React.useState(false);


  React.useEffect(() => {
    const fetchData = async () =>{
      const getData = httpsCallable(functions, 'getData');
      await getData().then((res) => {
        updateData((res.data as Array<DocumentJSON>));
        updateRetrieved(true);
      });
    }

    updateMobile(window.innerHeight > window.innerWidth);
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
    
    const button = isMobile ? <button onClick={() => router.push("/request")} className={'text-3xl font-bold absolute bg-secondary dark:bg-secondary-dark text-primary dark:text-primary-dark h-16 w-16 rounded-full top-[80%] left-[80%]'}>&#65291;</button> : <></>;
    return (
      <>
        <MobileContext.Provider value={isMobile}>
        <div className="w-[100%] h-[90%]">
          <Grid requests={data} updateRequests={updateData} filter={myFilter} retrieved={retrieved}/>
        </div>
        </MobileContext.Provider>
        {button}
      </>
    );
  }
  router.push("/");
}