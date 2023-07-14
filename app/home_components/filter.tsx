'use client'
import { useContext, useEffect, useState } from "react";
import { Filter, getAllClasses } from "../page";
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
        <button key={classname} onClick={switchClass} className={bg() + " p-2 mr-2 mb-2 rounded-xl  border-2 border-secondary dark:border-secondary-dark"}>
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
    const isMobile = useContext(MobileContext);
    const [active, setActive] = useState(false);
    
    
    const empty : JSX.Element[] = [];
    const [classFilters, updateClassFilters] = useState(empty);

    useEffect(() => {
        getClasses(filter, updateFilter, updateClassFilters);
    }, [filter])

    function saveFilter(){
        const saveFilterFunc = httpsCallable(functions, 'saveFilter');
        saveFilterFunc(filter).then((res) => {
            const status = (res.data as status).status;
            if(status == "Error"){
                alert("Error");
            }
        })
    }
    const divstyle = (active ? "duration-500 " + (isMobile ? "top-[40%]" : "top-[80%]"): 
    "duration-300 top-[92%]") + " " + (isMobile ? "h-[60%]" : "h-[20%]" ) + " ";
    return(
        <div className={divstyle + "bg-primary dark:bg-primary-dark ease-in-out w-[100%] fixed "}>
            <h3 onClick={() => setActive(!active)} className= { (isMobile ? "h-[15%]": "h-[40%]") + " " + "cursor-pointer trailing rounded-t-xl border-t-8 box-border border-t-secondary dark:border-t-secondary-dark text-center text-primary dark:text-primary-dark text-sm pl-4 bg-secondary dark:bg-secondary-dark"}>
                {active ? '\u25BC' : '\u25B2'} <br/>
                Filter
            </h3>
            <div className={"flex justify-between" + " " + (isMobile ? "w-full flex-col h-[85%]": "flex-row h-[60%] w-[85%] ml-auto mr-auto")}>
                <div className={isMobile ? "": "flex flex-col justify-center h-full"}>
                    <div className={"pt-4 " + (isMobile ? "mr-auto ml-auto w-fit":" ml-4 mr-4")}>
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
                    <div className={"mt-2 h-auto " + (isMobile ? "block ml-6 mr-6" : "ml-6 mr-6 inline-block")}>
                        <Grid2 columnSpacing={2} container>
                            {classFilters}
                        </Grid2>
                    </div>
                </div>
                <div className={"flex items-center justify-center" + " " +  (isMobile ? "mb-4 w-[100%]": "mr-4 min-h-full")}>
                    <button className="bg-[#0ea5e9] mr-4 p-4 rounded-md border-2 border-[#0ea5e9]" onClick={saveFilter}>SAVE</button>
                    <button className="border-secondary dark:border-secondary-dark border-2 p-4 rounded-md" onClick={() => {updateFilter(getAllClasses())}}>RESET</button>   
                </div>
            </div>
        </div>
    )

}