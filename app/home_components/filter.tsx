'use client'

import { useState } from "react";
import { Filter } from "../page";

export default function Filter({filter, updateFilter} : {filter: Filter, updateFilter: React.Dispatch<React.SetStateAction<Filter>>}){
    const [active, setActive] = useState(false);
    if(!active){
        return(
            <div onClick={() => setActive(true)} className={"ease-in-out before:top-[50%] duration-300 h-[50%] w-[100%] fixed top-[92.5%]"}>
                <h3 className="trailing rounded-t-xl border-t-8 box-border border-t-secondary dark:border-t-secondary-dark text-center text-primary dark:text-primary-dark text-sm pl-4 h-[8vh] bg-secondary dark:bg-secondary-dark">
                    &#9650; <br/>
                    Filters
                </h3>
            </div>
        )
    }
    return(
        <div onClick={() => setActive(false)} className={
            "before:top-[95%] ease-in-out duration-500 h-[75%] bg-primary dark:bg-primary-dark w-[100%] fixed top-[25%]"}>
            <h3 className="trailing rounded-t-xl border-t-8 box-border border-t-secondary dark:border-t-secondary-dark text-center text-primary dark:text-primary-dark text-sm pl-4 h-[8vh] bg-secondary dark:bg-secondary-dark">
                &#9660; <br/>
                Filters
            </h3>
        </div>
    )

}