import * as admin from "firebase-admin";
//@ts-ignore
import serviceworker from "../arabwallet-firebase.json";

admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceworker),
  databaseURL:
    "https://arab-wallet-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export { admin };

export const options = {
  priority: "high",
  timetoLive: 60 * 60 * 24,
};
