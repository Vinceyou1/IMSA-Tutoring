import { useRouter } from "next/navigation";
import { DocumentJSON } from "./page";
import { useContext } from "react";
import { FirebaseAuthContext } from "./contexts/FirebaseAuthContext";

export default function Request({request}:{request:DocumentJSON}){
    const router = useRouter();
    const uid = useContext(FirebaseAuthContext).currentUser?.uid;
    let button;
    if(request.data.uid == uid) {
        button = (
            <button className="border-solid h-fit p-4 border-[red] border-2 rounded font-bold text-[red]">
                DELETE</button>
        )
    } else {
        button = (
            <button className="border-solid border-secondary dark:border-secondary-dark border-2 pr-6 pl-6 rounded font-bold ">
                CLAIM</button>
        )
    }
    return(
        <div className="flex flex-row justify-between items-center
        bg-request dark:bg-request-dark max-w-[100%] break-words m-2 mr-0 p-2 rounded">
            <span>
                <p>{request.data.name}</p>
                <p>{request.data.class} with {request.data.teacher}</p>
                <p>{request.data.info}</p>
            </span>
            <div>

            {button}
            </div>
        </div>
            
    )
}