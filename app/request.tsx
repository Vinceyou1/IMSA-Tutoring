import { RequestJSON } from "./page";

export default function Request({request}:{request:RequestJSON}){
    return(
            <p>{request['name']}</p>
            <p>{request['info']}</p>
        <div onClick={()=>console.log("click")}
            className="bg-request dark:bg-request-dark max-w-[100%] break-words m-2 mr-0 p-2 rounded cursor-pointer hover:bg-[#193769] dark:hover:text-primary hover:text-primary">
        </div>
    )
}