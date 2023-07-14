'use client';
import initFirebase from "@/firebase/clientApp";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../loading";
import { classes } from "../classes/classes";

export default function Request(){
    
  const app = initFirebase();
  const firestore = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const functions = getFunctions(app);

  const [classList, updateClasses] = useState(
    <>
      {classes.Math.map((name) =>{
        return(<option key={name} value={name}>{name}</option>)
      })}
    </>
  );
  const subjects = (
    <>
      <option value="Math">Math</option>
      <option value="Computer Science">CS</option>
      <option value="Science">Science</option>
      <option value="Language">Language</option>
      <option value="English">English</option>
      <option value="History">History and SS</option>
    </>
  )

  const [subject, updateSubject] = useState("");
  
  function changeSubject(value: string) {
    switch(value){
      case "Math":
        updateClasses(
          <>
            {classes.Math.map((name) =>{
              return(<option key={name} value={name}>{name}</option>)
            })}
          </>
        );
        break;
      case "Computer Science":
        updateClasses(
          <>
            {classes.CS.map((name) =>{
              return(<option key={name} value={name}>{name}</option>)
            })}
          </>
        );
        break;
      case "Science":
        updateClasses(
          <>
            {classes.Science.map((name) =>{
              return(<option key={name} value={name}>{name}</option>)
            })}
          </>
        );
        break;
      case "Language":
        updateClasses(
          <>
            {classes.Language.map((name) =>{
              return(<option key={name} value={name}>{name}</option>)
            })}
          </>
        );
        break;
      case "English":
        updateClasses(
          <>
            {classes.English.map((name) =>{
              return(<option key={name} value={name}>{name}</option>)
            })}
          </>
        ); 
        break;
      case "History":
        updateClasses(
          <>
            {classes.History.map((name) =>{
              return(<option key={name} value={name}>{name}</option>)
            })}
          </>
        );
        break;
    }
    updateSubject(value);
    setTimeout(() =>{
      let class_select = (document.getElementById("class") as HTMLSelectElement);
      updateClass(class_select.value);
    }, 100);
  }

  const [_class, updateClass] = useState("Geometry");
  const postData = httpsCallable(functions, 'postData');
  const [submitLoading, updateSubmitLoading] = useState(false);
  function submit(){
    updateSubmitLoading(true);
    let teacher = (document.getElementById("teacher") as HTMLInputElement).value;
    let info = (document.getElementById("info") as HTMLInputElement).value;
    if(teacher == "") return alert("Please enter your teacher.");
    const subject_select = document.querySelector("#subject") as HTMLSelectElement;
    subject_select.value = "Math";
    const class_select = document.querySelector("#class") as HTMLSelectElement;
    class_select.value = "Geometry";
    (document.querySelector("#teacher") as HTMLInputElement).value = "";
    (document.querySelector("#info") as HTMLInputElement).value = "";
    postData({
      teacher: teacher,
      name: auth.currentUser?.displayName,
      subject: subject,
      _class: _class,
      info: info,
      uid: auth.currentUser?.uid
    }).then(() => {updateSubmitLoading(false)})
    .catch(() => {updateSubmitLoading(false); alert("There's been an error. Please try again.")})
    .then(() => {
      changeSubject("Math");
      updateClass("Geometry");
    });
  }

  
  if(loading || submitLoading){
    return(<Loading />)
  }
  if(!user){
    router.push("/");
  }
  return(
    <div className="flex justify-center flex-col items-center min-h-[80%]">
      <div className="flex justify-center">
        <form className='mt-8'>
          <div className="grid gap-x-2 gap-y-4" style={{gridTemplateColumns:"max-content max-content"}}>
              <label htmlFor="subject" className='text-lg text-right text-secondary dark:text-secondary-dark'>Subject:</label>
              <select id="subject" name="subject" className='rounded-sm text-secondary dark:text-primary-dark' onChange={(event) => changeSubject(event.target.value)}>
                {subjects}
              </select>

              <label htmlFor="class" className='text-lg text-right text-secondary dark:text-secondary-dark'>Class:</label>
              <select id="class" name="class" className="rounded-sm text-secondary dark:text-primary-dark" onChange={(event) => updateClass(event.target.value)}>
                {classList}
              </select>
              
              <label htmlFor="teacher" className='text-lg text-right text-secondary dark:text-secondary-dark'>Teacher:</label> 
              <input type="text" id="teacher" name="teacher" className='rounded-sm text-secondary dark:text-primary-dark pl-1'></input>

              <label htmlFor="info" className='text-lg text-right text-secondary dark:text-secondary-dark'>Additional Info:</label> 
              <input type="text" id="info" name="info" className='rounded-sm text-secondary dark:text-primary-dark pl-1'></input>
          </div>
        </form>
      </div>
      <div className="flex justify-center mt-20">
        <button id='submit' onClick={() => submit()} className="rounded-md text-2xl bg-secondary dark:bg-secondary-dark p-4 text-primary dark:text-primary-dark">Submit</button>
      </div>
    </div>
  )
}