/* eslint indent: "off", brace-style: "off", no-trailing-spaces: "off"*/
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const onNewUserCreated =
functions.auth.user().onCreate((user) =>{
  const email = user.email;
  if (email?.slice(email.indexOf("@")) != "@imsa.edu") {
    getAuth().deleteUser(user.uid).then(() =>
      {
        console.log("Successfully deleted user");
      }
    ).catch((error) =>
      {
        console.log("Error deleting user:", error);
      }
    );
  }
});

export const postData = onCall((request) => {
  const name = request.data.name;
  const subject = request.data.subject;
  const _class = request.data._class;
  const teacher = request.data.teacher;
  const info = request.data.info;
  const uid = request.auth?.uid;
  const post = Date.now();
  return getFirestore().collection("requests").add({
    time: post,
    name: name,
    subject: subject,
    class: _class,
    teacher: teacher,
    info: info,
    uid: uid,
  }).then(() => {
    return {status: "success"};
  }).catch(() => {
    return {status: "error"};
  });
});

export const helloWorld = onRequest((request, response) => {
  admin.firestore().doc("requests/twEf65aiByX6wI2zwF1V").get().then(
    (snapshot) => {
      const data = snapshot.data();
      response.send(data);
    }
  ).catch(
    (error) => {
      console.log(error);
      response.status(500).send(error);
    }
  );
});
