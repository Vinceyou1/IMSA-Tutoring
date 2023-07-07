'use client';
import initFirebase from "@/firebase/clientApp";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../loading";

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
      <option value="Geometry">Geometry</option>
      <option value="MI I/II">MI I/II</option>
      <option value="MI II">MI II</option>
      <option value="MI III">MI III</option>
      <option value="MI IV">MI IV</option>
      <option value="Survey of Calculus">Survey of Calculus</option>
      <option value="AB I">AB I</option>
      <option value="AB II">AB II</option>
      <option value="BC I">BC I</option>
      <option value="BC II">BC II</option>
      <option value="BC III">BC III</option>
      <option value="BC I/II">BC I/II</option>
      <option value="BC II/III">BC II/III</option>
    </>
  );
  const subjects = (
    <>
      <option value="Math">Math</option>
      <option value="Computer Science">Computer Science</option>
      <option value="Science">Science</option>
      <option value="Language">Language</option>
      <option value="English">English</option>
      <option value="History and SS">History and SS</option>
    </>
  )

  const [subject, updateSubject] = useState("");
  
  function changeSubject(value: string) {
    switch(value){
      case "Math":
        updateClasses(
          <>
            <option value="Geometry">Geometry</option>
            <option value="MI I/II">MI I/II</option>
            <option value="MI II">MI II</option>
            <option value="MI III">MI III</option>
            <option value="MI IV">MI IV</option>
            <option value="Survey of Calculus">Survey of Calculus</option>
            <option value="AB I">AB I</option>
            <option value="AB II">AB II</option>
            <option value="BC I">BC I</option>
            <option value="BC II">BC II</option>
            <option value="BC III">BC III</option>
            <option value="BC I/II">BC I/II</option>
            <option value="BC II/III">BC II/III</option>
          </>
        );
        break;
      case "Computer Science":
        updateClasses(
          <>
            <option value="CSI">CSI</option>
            <option value="OOP">OOP</option>
            <option value="Advanced Programming">Advanced Programming</option>
            <option value="Microcontroller Applications">Microcontroller Applications</option>
            <option value="Web Technologies">Web Technologies</option>
          </>
        ); 
        break;
      case "Science":
        updateClasses(
          <>
            <option value="MSI">MSI</option>
            <option value="SI-Chemistry">SI-Chemistry</option>
            <option value="SI-Physics">SI-Physics</option>
          </>
        );
        break;
      case "Language":
        updateClasses(
          <>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Mandarin">Mandarin</option>
          </>
        ); 
        break;
      case "English":
        updateClasses(
          <>
            <option value="LE I">LE I</option>
            <option value="LE II">LE II</option>
            <option value="LE III: American">LE III: American</option>
            <option value="LE III: British">LE III: British</option>
            <option value="LE III: World">LE III: World</option>
          </>
        ); break;
      case "History and SS":
        updateClasses(
          <>
            <option value="American Studies">American Studies</option>
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
    }).then(() => {updateSubmitLoading(false); alert("Success!")})
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
    window.location.replace("/")
    console.log(user);
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
              <input type="text" id="teacher" name="teacher" className='rounded-sm text-secondary dark:text-primary-dark'></input>

              <label htmlFor="info" className='text-lg text-right text-secondary dark:text-secondary-dark'>Additional Info:</label> 
              <input type="text" id="info" name="info" className='rounded-sm text-secondary dark:text-primary-dark'></input>
          </div>
        </form>
      </div>
      <div className="flex justify-center mt-20">
        <button onClick={() => submit()}className="rounded-md text-2xl bg-secondary dark:bg-secondary-dark p-4 text-primary dark:text-primary-dark">Submit</button>
      </div>
    </div>
  )
}