import { useRouter } from "next/navigation";
import { RequestJSON } from "./page";

export default function Request({request}:{request:RequestJSON}){
    const router = useRouter();
    return(
        <a href={"/request/" + request.id}
            className="bg-request block dark:bg-request-dark max-w-[100%] break-words m-2 mr-0 p-2 rounded cursor-pointer hover:bg-[#193769] dark:hover:text-primary hover:text-primary">
            <p>{request['data']['name']} - {request['data']['subject']}</p>
            <p>{request['data']['class']} with {request['data']['teacher']}</p>
        </a>
    )
}