import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Request from './request';
import { DocumentJSON, Filter } from "../page";
import { useEffect, useState } from 'react';
import { FirebaseFunctionsContext } from '../contexts/FirebaseFunctionsContext';
import { httpsCallable } from 'firebase/functions';
import { useContext } from "react";
import { MobileContext } from '../contexts/MobileContext';
import Loading from '../loading';

export default function Grid({requests, filter, retrieved} : {requests: DocumentJSON[], filter: Filter, retrieved:boolean}){
    let grid;
    const isMobile = useContext(MobileContext);
    const [data, updateData] = useState(requests);
    const [cols, updateCols] = useState([[{id: "not rendered"} as DocumentJSON]]);
    const num_cols = isMobile ? 1 : 4;
    
    const functions = useContext(FirebaseFunctionsContext);
    const deleteDocument = httpsCallable(functions, "deleteDocument");

    function dataUpdate(temp: DocumentJSON[]){
      updateData(temp);
      let filtered = [...data];
      for(let index = 0; index < filtered.length;){
        if(filtered[index].data.claimed || (!(filter.classes.includes(filtered[index].data.class)))
        ) {
            filtered.splice(index, 1);
        } else {index++;}
      }
      if(filtered.length == 0){
        return updateCols([]);
      }
      let temp_cols: DocumentJSON[][] = [[filtered[0]]];
      for(let i = 1; i < num_cols && i < filtered.length; i++){ temp_cols.push([filtered[i]]);}
      for(let i = num_cols; i < filtered.length; i++){
        temp_cols[i % num_cols].push(filtered[i]);
      }
      updateCols(temp_cols);
    }
    
    type status = {
      Status: string
    }


    async function deleteItem(request: DocumentJSON){
      const deleteButton = document.getElementById("delete: " + request.id);
      (deleteButton as HTMLButtonElement).innerHTML = "LOADING...";
      await deleteDocument({id: request.id})
      .then((result) => {
        if((result.data as status).Status == "Success"){
          let temp = data;
          temp.filter((value, index, array) =>{
            if(value.id == request.id){
              array.splice(index, 1);
            }
          });
          dataUpdate(temp);
        } else {
          alert("There was an error deleting the request");
          (deleteButton as HTMLButtonElement).innerHTML = "DELETE";
        }
      });
    }

    useEffect(() => {
      const generateCols = () => {
        dataUpdate(requests);
      }
      generateCols();
    }, [requests, filter]);

    if(!retrieved){
      return <Loading />
    }
    if(data.length == 0){
      grid = (
        <div className='h-[80%] flex justify-center items-center text-lg'>
          <p>There are no requests at this time</p>
        </div>
      );
    } else {
      // for(let index = 0; index < data.length;){
      //     if(data[index].data.claimed || (filter.classes.length != 0 && !(data[index].data.class in filter.classes))
      //     ) {
      //         data.splice(index, 1);
      //     } else {index++;}
      // }
      // if(data.length == 0){
      //     return(
      //         <div className='h-[80%] flex justify-center items-center text-lg'>
      //         <p>There are no requests with the selected filters</p>
      //         </div>
      //     )
      // }
      // const num_cols = isMobile ? 1 : 4;
      // let cols: DocumentJSON[][] = [[data[0]]];
      // for(let i = 1; i < num_cols && i < data.length; i++){ cols.push([data[i]]);}
      // for(let i = num_cols; i < data.length; i++){
      //   cols[i % num_cols].push(data[i]);
      // }
      if(cols.length == 0){
        return(
          <div className='h-[80%] flex justify-center items-center text-lg'>
            <p>There are no requests with the selected filters</p>
          </div>
        )
      }
      if(cols[0].length == 1 && cols[0][0].id == "not rendered"){
          return <Loading />
      }
      grid = (
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
    return(grid);
}