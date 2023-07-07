/* eslint indent: "off", brace-style: "off", no-trailing-spaces: "off"*/

import {onCall} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";


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

export const getData = onCall(() => {
  return getFirestore().collection("requests").orderBy("time").get()
  .then((snapshot) => {
    return snapshot.docs.map((doc) =>{
      const json = doc.data();
      const id = doc.id;
      return ({id: id, data: json});
    });
  }).catch(() => {
    return "error";
  });
});

export const getDocument = onCall((request) =>{
  return getFirestore().doc("requests/" + request.data.id).get()
  .then((snapshot) => {
    return snapshot.data();
  }).catch(() => {
    return "error";
  });
});
