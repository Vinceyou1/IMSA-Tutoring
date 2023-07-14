import { useRouter } from "next/navigation";
import { DocumentJSON } from "../page";
import { useContext } from "react";
import { FirebaseAuthContext } from "../contexts/FirebaseAuthContext";

export default function Request({request, deleteItem, claimRequest, unclaimRequest}:{request:DocumentJSON, deleteItem: (request: DocumentJSON) => void, claimRequest: (request: DocumentJSON) => void, unclaimRequest: (request: DocumentJSON) => void}){
    const uid = useContext(FirebaseAuthContext).currentUser?.uid;
    let button;
    if(request.data.uid == uid) {
        button = (
            <button id={"delete: " + request.id} onClick={() => deleteItem(request)} className="border-solid h-fit p-4 border-[red] border-2 rounded font-bold text-[red]">
                DELETE</button>
        )
    } else if(request.data.claimed && request.data.tutor_uid == uid){
        button = (
            <button id={"claim: " + request.id} onClick={() => unclaimRequest(request)}className="border-solid border-secondary dark:border-secondary-dark border-2 p-4 font-bold rounded">
                UNCLAIM</button>
        )
    } else {
        button = (
            <button id={"claim: " + request.id} onClick={() => claimRequest(request)}className="border-solid border-secondary dark:border-secondary-dark border-2 p-4 font-bold rounded">
                CLAIM</button>
        )
    }
    const claimedBy = (request.data.claimed && request.data.uid == uid) ? <p>Claimed by {request.data.tutor_name}</p> : <></>;
    return(
        <div className="flex flex-row justify-between items-center
        bg-request dark:bg-request-dark max-w-[100%] break-words mt-2 p-2 rounded">
            <span>
                <p>{request.data.name}</p>
                <p>{request.data.class} with {request.data.teacher}</p>
                <p>{request.data.info}</p>
                {claimedBy}
            </span>
            <div>

            {button}
            </div>
        </div>
    )
}