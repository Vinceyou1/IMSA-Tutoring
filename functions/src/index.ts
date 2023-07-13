/* eslint-disable*/

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
    claimed: false,
    tutor: "",
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
  .then(() => {
    return {
      Status: "Success",
    };
  }).catch(() => {
    return {
      Status: "Error",
    };
  });
});

export const deleteDocument = onCall((request) => {
  return getFirestore().doc("requests/" + request.data.id).delete()
  .then(() => {
    return {
      Status: "Success",
    };
  }).catch(() => {
    return {
      Status: "Error",
    };
  });
});

export const saveFilter = onCall((request) => {
  if (request.auth?.uid) {
      return getFirestore().collection("filters").doc(request.auth.uid)
      .set({
        classes: request.data.classes
      })
      .then(() => {
        return {
          Status: "Success",
        };
      }).catch(() => {
        return {
          Status: "Error",
        };
      });
    }
  else {
    return {
      Status: "Error",
    };
  }
});

export const getFilter = onCall((request) => {
  if (request.auth?.uid) {
    const filterRef = getFirestore().collection("filters").doc(request.auth.uid);
    return filterRef.get()
    .then((doc) => {
      if (doc.exists) {
        return(doc.data())
      } else {
        return {
          classes: ["none"]
        }
      }
    }).catch(() => {
      return {
        classes: ["error"]
      };
    });
  }
  else {
    return {
      classes: ["error"]
    };
  }
});
