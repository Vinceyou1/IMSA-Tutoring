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
import { MobileContext } from './contexts/MobileContext';
import { classes } from './classes/classes';


export type RequestJSON = {
  uid: string,
  teacher: string,
  class: string, 
  subject: string,
  name: string,
  info: string,
  time: number,
  claimed: boolean,
  tutor_name: string,
  tutor_uid: string,
}

export type DocumentJSON = {
  id: string,
  data: RequestJSON
}

export type Filter = {
  classes: string[]
}

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
  const defaultFilter:Filter = getAllClasses();
  
  const [filter, updateFilter] = React.useState(defaultFilter);

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

  React.useEffect(() => {
    const fetchFilter = async () => {
      if(!user) return;
      const getFilter = httpsCallable(functions, 'getFilter');
      let res = await getFilter({});
      let temp = res.data as Filter;
      if(temp.classes.length == 1 && ["error", "none"].includes(temp.classes[0])) return;
      updateFilter(temp);
    }
    
    fetchFilter();
  }, [user]);

  if(loading){
    return (<Loading />)
  }
  if(user){
    // const email = user.email;
    // if(email?.slice(email.indexOf("@")) != "@imsa.edu"){
    //   return (
    //     <main className="min-h-[90%]">
    //       <p className='text-center'>Please reload the page and sign in with your IMSA email.</p>
    //     </main>
    //   )
    // }
    

    const changeFilter = (new_filter: Filter) => {
      updateFilter(new_filter);
    }
    const button = isMobile ? <button onClick={() => router.push("/request")} className={'z-[-1] text-3xl font-bold absolute bg-secondary dark:bg-secondary-dark text-primary dark:text-primary-dark h-16 w-16 rounded-full top-[80%] left-[80%]'}>&#65291;</button> : <></>;
    return (
      <MobileContext.Provider value={isMobile}>
      <div className={"w-[100%] h-[90%]"}>
        <Filter filter={filter} updateFilter={(new_filter: Filter) => changeFilter(new_filter)}/>
        <Grid requests={data} updateRequests={updateData} filter={filter} retrieved={retrieved}/>
        {button}
      </div>
      </MobileContext.Provider>
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