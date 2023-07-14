import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Request from './request';
import { DocumentJSON, Filter } from "../page";
import { useEffect, useState } from 'react';
import { FirebaseFunctionsContext } from '../contexts/FirebaseFunctionsContext';
import { httpsCallable } from 'firebase/functions';
import { useContext } from "react";
import { MobileContext } from '../contexts/MobileContext';
import Loading from '../loading';
import { FirebaseAuthContext } from '../contexts/FirebaseAuthContext';

export type status = {
  Status: string
}

export default function Grid({requests, updateRequests, filter, retrieved} : {requests: DocumentJSON[], updateRequests: React.Dispatch<React.SetStateAction<DocumentJSON[]>>, filter: Filter, retrieved:boolean}){
    const isMobile = useContext(MobileContext);
    const [cols, updateCols] = useState([[{id: "not rendered"} as DocumentJSON]]);
    const uid = useContext(FirebaseAuthContext).currentUser?.uid;
    const [filtered, updateFiltered] = useState(false);
    const num_cols = isMobile ? 1 : 4;
    
    const functions = useContext(FirebaseFunctionsContext);
    const deleteDocument = httpsCallable(functions, "deleteDocument");

    function dataUpdate(temp: DocumentJSON[]){
      let filtered = [...temp];
      if(filter.classes.length == 1 && filter.classes[0] == "mine"){
        for(let index = 0; index < filtered.length;){
          if(filtered[index].data.uid != uid) filtered.splice(index, 1);
          else index++;
        }
      }
      else{
        for(let index = 0; index < filtered.length;){
          if(filtered[index].data.claimed || (!(filter.classes.includes(filtered[index].data.class))) || filtered[index].data.uid == uid) {
              filtered.splice(index, 1);
          } else {index++;}
        }
      }
      if(filtered.length == 0){
        updateCols([]);
      } else {
        let temp_cols: DocumentJSON[][] = [[filtered[0]]];
        for(let i = 1; i < num_cols && i < filtered.length; i++){ temp_cols.push([filtered[i]]);}
        for(let i = num_cols; i < filtered.length; i++){
          temp_cols[i % num_cols].push(filtered[i]);
        }
        updateCols(temp_cols);

      }
      updateFiltered(true);
    }
    


    async function deleteItem(request: DocumentJSON){
      const deleteButton = document.getElementById("delete: " + request.id);
      (deleteButton as HTMLButtonElement).innerHTML = "LOADING...";
      await deleteDocument({id: request.id})
      .then((result) => {
        if((result.data as status).Status == "Success"){
          let temp = [...requests];
          temp.filter((value, index, array) =>{
            if(value.id == request.id){
              array.splice(index, 1);
            }
          });
          dataUpdate(temp);
          updateRequests(temp);
        } else {
          alert("There was an error deleting the request");
          (deleteButton as HTMLButtonElement).innerHTML = "DELETE";
        }
      });
    }

    useEffect(() => {
      const generateCols = () => {
        dataUpdate(requests);
        console.log(filter);
      }
      generateCols();
    }, [requests, filter]);

    useEffect(() => {
      const logData = () =>{
        console.log(filtered);
        setTimeout(logData, 1000);
      }
      logData();
    })
    if(!retrieved) return <Loading />

    if(requests.length == 0){
      return (
        <div className='h-[80%] flex justify-center items-center text-lg'>
          <p>There are no requests at this time</p>
        </div>
      );
    } else {
      if(!filtered){
        return (<Loading />);
      }
      if(cols.length == 0){
        for(let i = 0; i < requests.length; i++){
          if(requests[i].data.uid == uid){
            return (
              <div className='h-[80%] flex justify-center items-center text-lg'>
                <p>There are no requests at this time</p>
              </div>
            );
          }
        }
        return(
          <div className='h-[80%] flex justify-center items-center text-lg text-center'>
            <p>There are no requests with the selected filters</p>
          </div>
        )
      }
      if(cols[0].length == 1 && cols[0][0].id == "not rendered"){
          return <Loading />
      }
      return (
      <Grid2 container sx={{marginLeft: 0.5, marginRight: 0.5, display: "flex"}}> 
        {cols.map((col) => {  
          return (
            <Grid2 key={cols.indexOf(col)} xs={12/num_cols}>
              { col.map((item: DocumentJSON) => <Request deleteItem={deleteItem} key={item.id} request={item} />)}
            </Grid2>
          )
        })}
      </Grid2>
      );
    }
}