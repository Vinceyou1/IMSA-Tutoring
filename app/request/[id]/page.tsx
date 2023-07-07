'use client'
import { FirebaseFunctionsContext } from "@/app/contexts/FirebaseFunctionsContext"
import { httpsCallable } from "firebase/functions";
import { useContext, useEffect, useState } from "react"

export default function Page({ params } : {params: {id: string}}) {
  const functions = useContext(FirebaseFunctionsContext);
  const [data, updateData] = useState({});
  const getDocument = httpsCallable(functions, 'getDocument');

  useEffect(() =>{
    const fetchData = async () =>{
      let res = await getDocument({
        id: params.id
      });
      let requests = res.data;
      updateData(requests as JSON);
    }
    fetchData();
  }, []);
  return (
    <div>

    </div>
  )
}