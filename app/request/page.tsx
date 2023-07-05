'use client';
import initFirebase from "@/firebase/clientApp";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Request(){
    
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [classList, updateClasses] = useState(
    <>
      <option value="geometry">Geometry</option>
      <option value="mi1/2">MI I/II</option>
      <option value="mi2">MI II</option>
      <option value="mi3">MI III</option>
      <option value="mi4">MI IV</option>
      <option value="surveyofcalc">Survey of Calculus</option>
      <option value="ab1">AB I</option>
      <option value="ab2">AB II</option>
      <option value="bc1">BC I</option>
      <option value="bc2">BC II</option>
      <option value="bc3">BC III</option>
      <option value="bc1/2">BC I/II</option>
      <option value="bc2/3">BC II/III</option>
    </>
  );
  const subjects = (
    <>
      <option value="math">Math</option>
      <option value="cs">Computer Science</option>
      <option value="science">Science</option>
      <option value="language">Language</option>
      <option value="english">English</option>
      <option value="history_and_ss">History and SS</option>
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
            <option value="geometry">Geometry</option>
            <option value="mi1/2">MI I/II</option>
            <option value="mi2">MI II</option>
            <option value="mi3">MI III</option>
            <option value="mi4">MI IV</option>
            <option value="surveyofcalc">Survey of Calculus</option>
            <option value="ab1">AB I</option>
            <option value="ab2">AB II</option>
            <option value="bc1">BC I</option>
            <option value="bc2">BC II</option>
            <option value="bc3">BC III</option>
            <option value="bc1/2">BC I/II</option>
            <option value="bc2/3">BC II/III</option>
          </>
        );
        break;
      case "cs":
          updateClasses(
            <>
              <option value="csi">CSI</option>
              <option value="oop">OOP</option>
              <option value="adpro">Advanced Programming</option>
              <option value="micro">Microcontroller Applications</option>
              <option value="webtech">Web Technologies</option>
            </>
          )
          break;
    }
  }

  const [_class, updateClass] = useState("Geometry");

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
        <button className="rounded-md text-2xl bg-secondary dark:bg-secondary-dark p-4 text-primary dark:text-primary-dark">Submit</button>
      </div> 
    </div>
  )
}