'use client'

import { useState } from "react";
import { Filter } from "../page";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

function FilterClass(classname: string, filter:Filter, updateFilter: React.Dispatch<React.SetStateAction<Filter>>){
    function removeClass(){
        let temp:Filter = {
            classes: []
        };
        filter.classes.forEach(element => {
            if(element != classname){
                temp.classes.push(element);
            }
        });
        updateFilter(temp);
    }
    return (
        <div className="p-2 rounded-full bg-primary dark:bg-primary-dark border-2 border-secondary dark:border-secondary-dark">
            {classname}
            <button onClick={removeClass}>X</button>
        </div>
    )
}

export default function Filter({filter, updateFilter} : {filter: Filter, updateFilter: React.Dispatch<React.SetStateAction<Filter>>}){
    const [active, setActive] = useState(false);
    const isMobile = screen.height > screen.width;
    const grid_elements = isMobile ? 3 : 12;
    let styles = active ? "before:top-[95%] duration-500 bg-primary dark:bg-primary-dark top-[25%]": 
        "before:top-[50%] duration-300 top-[92.5%]";
    let arrow = active ? '\u25BC' : '\u25B2';
    return(
        <div className={styles + " h-[75%] ease-in-out w-[100%] fixed"}>
            <h3 onClick={() => setActive(!active)} className="cursor-pointer trailing rounded-t-xl border-t-8 box-border border-t-secondary dark:border-t-secondary-dark text-center text-primary dark:text-primary-dark text-sm pl-4 h-[8vh] bg-secondary dark:bg-secondary-dark">
                {arrow} <br/>
                Filters
            </h3>
            <Grid2 container sx={{
                margin: 1
            }}>
                {filter.classes.map((classname) =>{
                    return(
                        <Grid2 xs={12/grid_elements}>
                            {FilterClass(classname, filter, updateFilter)}
                        </Grid2>
                    )
                })}
            </Grid2>
        </div>
    )

}