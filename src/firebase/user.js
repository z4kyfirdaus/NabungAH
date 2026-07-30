import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function saveProfile(data) {
  const uid = auth.currentUser.uid;

  await setDoc(
    doc(db, "users", uid),
    {
      profile: data,
    },
    { merge: true }
  );
}

export async function loadProfile() {
  const uid = auth.currentUser.uid;

  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return snap.data().profile;
}