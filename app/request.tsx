import { RequestJSON } from "./page";

export default function Request({request}:{request:RequestJSON}){
    return(
        <div className="bg-secondary max-w-[100%] break-words">
            <p>{request['name']}</p>
            <p>{request['info']}</p>
        </div>
    )
}