'use client';
import initFirebase from "@/firebase/clientApp";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Request(){
    
  const app = initFirebase();
  const firestore = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

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
  
  function changeSubject(event: React.ChangeEvent<HTMLSelectElement>) {
    updateSubject(event.target.value);
    console.log(event.target.value);
    switch(event.target.value){
      case "math":
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
        ); break;
      case "Science":
        updateClasses(
          <>
            <option value="MSI">MSI</option>
            <option value="SI-Chemistry">SI-Chemistry</option>
            <option value="SI-Physics">SI-Physics</option>
          </>
        );break;
      case "Language":
        updateClasses(
          <>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Mandarin">Mandarin</option>
          </>
        ); break;
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
        )
    }
  }

  const [_class, updateClass] = useState("Geometry");

  function submit(){
    let teacher = (document.getElementById("teacher") as HTMLInputElement).value;
    let info = (document.getElementById("info") as HTMLInputElement).value;
  }
  return(
    <div className="flex justify-center flex-col items-center min-h-[80%]">
      <div className="flex justify-center">
        <form className='mt-8'>
          <div className="grid gap-x-2 gap-y-4" style={{gridTemplateColumns:"max-content max-content"}}>
              <label htmlFor="subject" className='text-lg text-right text-secondary dark:text-secondary-dark'>Subject:</label>
              <select id="subject" name="subject" className='rounded-sm text-secondary dark:text-primary-dark' onChange={changeSubject}>
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