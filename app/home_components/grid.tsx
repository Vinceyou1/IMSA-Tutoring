'use client'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Request from './request';
import { DocumentJSON, Filter } from "../page";

export default function Grid({data, filter} : {data: DocumentJSON[], filter: Filter}){
    let grid;
    const isMobile = screen.height < screen.width;
    if(data.length == 0){
        grid = (
          <div className='h-[80%] flex justify-center items-center text-lg'>
            <p>There are no requests at this time</p>
          </div>
        );
      } else {
        const filtered = JSON.parse(JSON.stringify(data));
        for(let index = 0; index < filtered.length;){
            if(filtered[index].data.claimed || (filter.classes.length != 0 && !(filtered[index].data.class in filter.classes))
            ) {
                filtered.splice(index, 1);
            } else {index++;}
        }
        if(filtered.length == 0){
            return(
                <div className='h-[80%] flex justify-center items-center text-lg'>
                <p>There are no requests with the selected filters</p>
                </div>
            )
        }
        const num_cols = isMobile ? 4 : 1;
        let cols: DocumentJSON[][] = [[filtered[0]]];
        for(let i = 1; i < num_cols && i < filtered.length; i++){ cols.push([filtered[i]]);}
        for(let i = num_cols; i < filtered.length; i++){
          cols[i % num_cols].push(filtered[i]);
        }
        grid = (
        <Grid2 container sx={{marginLeft: 0.5, marginRight: 0.5, display: "flex"}}> 
          {cols.map((col) => {
            return (
              <Grid2 key={cols.indexOf(col)} xs={12/num_cols}>
                { col.map((item: DocumentJSON) => <Request key={item.data.time} request={item} />)}
              </Grid2>
            )
          })}
        </Grid2>
        );
      }
      return(grid);
}