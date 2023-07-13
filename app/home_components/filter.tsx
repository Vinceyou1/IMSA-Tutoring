'use client'
import { useContext, useEffect, useState } from "react";
import { Filter } from "../page";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { MobileContext } from "../contexts/MobileContext";
import { classes } from "../classes/classes";
import { FirebaseFunctionsContext } from "../contexts/FirebaseFunctionsContext";
import { httpsCallable } from "firebase/functions";
import { status } from "./grid";


function FilterClass(classname: string, filter:Filter, updateFilter: (new_filter : Filter) => void, updateClassFilters: React.Dispatch<React.SetStateAction<JSX.Element[]>>){
    let active = filter.classes.includes(classname);
    function switchClass(){
        let temp = JSON.parse(JSON.stringify(filter)) as Filter;
        if(active){
            for(let i = 0; i < temp.classes.length; i++){
                if(temp.classes[i] === classname){
                    temp.classes.splice(i, 1); break;
                }
            }
        } else {
            temp.classes.push(classname);
        }
        getClasses(temp, updateFilter, updateClassFilters);
    }
    function bg(){
        return(active ? "bg-filter-active dark:bg-filter-active-dark" : "bg-primary dark:bg-primary-dark");
    }
    return (
        <button key={classname} onClick={switchClass} className={bg() + " p-2 mr-2 mb-1 rounded-xl  border-2 border-secondary dark:border-secondary-dark"}>
            {classname}
        </button>
    )
}

function subjectToClassArray(subject: string){
    switch (subject){
        case "Math":
            return classes.Math
        case "CS":
            return classes.CS;
        case "Science":
            return classes.Science;
        case "Language":
            return classes.Language;
        case "English":
            return classes.English;
        case "History":
            return classes.History;
    }
    return [''];
}

function getClasses(filter: Filter, updateFilter: (new_filter : Filter) => void, updateClassFilters: React.Dispatch<React.SetStateAction<JSX.Element[]>>){
    const subject = (document.getElementById("subject") as HTMLSelectElement).value
    let class_list:JSX.Element[] = [];
    let options = subjectToClassArray(subject);
    updateFilter(filter);  
    options.forEach(element => {
        class_list.push(
            FilterClass(element, filter, updateFilter, updateClassFilters)
        );
    });
    updateClassFilters(class_list);
}

function selectAll(filter: Filter, updateFilter: (new_filter : Filter) => void, updateClassFilters: React.Dispatch<React.SetStateAction<JSX.Element[]>>){
    const subject = (document.getElementById("subject") as HTMLSelectElement).value;
    let class_list = subjectToClassArray(subject);
    let temp = JSON.parse(JSON.stringify(filter));
    class_list.forEach((element) => {
        if(!temp.classes.includes(element)){
            temp.classes.push(element);
        }
    });
    getClasses(temp, updateFilter, updateClassFilters);
}

function clear(filter: Filter, updateFilter: (new_filter : Filter) => void, updateClassFilters: React.Dispatch<React.SetStateAction<JSX.Element[]>>){
    const subject = (document.getElementById("subject") as HTMLSelectElement).value;
    let class_list = subjectToClassArray(subject);
    let temp = JSON.parse(JSON.stringify(filter));
    for(let i = 0; i < temp.classes.length;){
        if(class_list.includes(temp.classes[i])){
            temp.classes.splice(i, 1);
        } else i++;
    }
    getClasses(temp, updateFilter, updateClassFilters);
}

export default function Filter({filter, updateFilter} : {filter: Filter, updateFilter: (new_filter : Filter) => void}){
    const functions = useContext(FirebaseFunctionsContext);
    const [active, setActive] = useState(false);
    let styles = active ? "before:top-[95%] duration-500 top-[25%]": 
        "before:top-[50%] duration-300 top-[92.5%]";
    let arrow = active ? '\u25BC' : '\u25B2';
    
    const empty : JSX.Element[] = [];
    const [classFilters, updateClassFilters] = useState(empty);

    useEffect(() => {
        getClasses(filter, updateFilter, updateClassFilters);
    }, [filter])

    function saveFilter(){
        const saveFilterFunc = httpsCallable(functions, 'saveFilter');
        saveFilterFunc(filter).then((res) => {
            const status = (res.data as status).Status;
            if(status == "Error"){
                alert("Error");
            }
        })
    }

    return(
        <div className={styles + " bg-primary dark:bg-primary-dark h-[75%] ease-in-out w-[100%] fixed"}>
            <h3 onClick={() => setActive(!active)} className="cursor-pointer trailing rounded-t-xl border-t-8 box-border border-t-secondary dark:border-t-secondary-dark text-center text-primary dark:text-primary-dark text-sm pl-4 h-[8vh] bg-secondary dark:bg-secondary-dark">
                {arrow} <br/>
                Filter
            </h3>
            <div className="pt-4 pl-4">
                <label className="text-lg" htmlFor="subject">Subject:&emsp;</label>
                <select id="subject" className="bg-primary dark:bg-primary-dark border-2 rounded-none text-lg" onChange={() => getClasses(filter, updateFilter, updateClassFilters)}>
                    <option value="Math">Math</option>
                    <option value="CS">CS</option>
                    <option value="Science">Science</option>
                    <option value="Language">Language</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                </select>
                <button className="pl-2 pr-2" onClick={() => selectAll(filter, updateFilter, updateClassFilters)}>Select All</button>|
                <button className="pl-2" onClick={() => clear(filter, updateFilter, updateClassFilters)}>Clear</button>
            </div>
            <div className="overflow-y-auto relative h-auto">
                <Grid2 container sx={{marginLeft: 2, marginTop: 1, height: "100%"}}>
                    {classFilters}
                </Grid2>
            </div>
            <button onClick={saveFilter}>SAVE</button>
        </div>
    )

}