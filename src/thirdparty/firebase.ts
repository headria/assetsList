import * as admin from "firebase-admin";
//@ts-ignore
import serviceworker from "../arabwallet-firebase.json";

admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceworker),
  databaseURL:
    "mongodb+srv://arab2wallet:Ej6N8spsk4PngIj4@cluster0.vnbkz.mongodb.net/arabwallet?authSource=admin&replicaSet=atlas-494rie-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
});

export { admin };

export const options = {
  priority: "high",
  timetoLive: 60 * 60 * 24,
};
